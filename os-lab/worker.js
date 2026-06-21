/**
 * Cloudflare Worker to serve C program sets via curl.
 * Usage: 
 *   curl -sL https://your-worker.workers.dev/set-1 | bash
 *   curl -sL https://your-worker.workers.dev/1 | bash
 */

const sets = {
  "1": {
    "orphan.c": `// orphan.c
// Compile: cc orphan.c
// Run:     ./a.out

#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

void main()
{
    int pid;
    printf("Demonstration of fork() orphan\\n");

    pid = fork();

    if (pid < 0)
    {
        perror("process not created");
        exit(0);
    }
    else if (pid > 0)
    {
        printf("parent process\\n");
        printf("from parent pid: %d\\n", getpid());
        printf("from parent ppid: %d\\n", getppid());
    }
    else if (pid == 0)
    {
        sleep(1);
        printf("\\n");
        system("ps -l");
        printf("child process\\n");
        printf("from child pid: %d\\n", getpid());
        printf("from child ppid: %d\\n", getppid());
    }
}`,
    "producerconsumer.c": `// producerconsumer.c
// Compile: cc producerconsumer.c
// Run:     ./a.out <buffer_size>   e.g.: ./a.out 5

#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <sys/shm.h>
#include <fcntl.h>

#define FULL  0
#define EMPTY 1
#define MUTEX 2
#define KEY   50

int semid;
int shmid;

int sem_wait(int id, int index)
{
    struct sembuf operation;
    operation.sem_num = index;
    operation.sem_op  = -1;
    operation.sem_flg = 0;
    return semop(id, &operation, 1);
}

int sem_signal(int id, int index)
{
    struct sembuf operation;
    operation.sem_num = index;
    operation.sem_op  = 1;
    operation.sem_flg = 0;
    return semop(id, &operation, 1);
}

int main(int argc, char *argv[])
{
    int i, pid;
    int *shm_addr;
    int value = 0;

    if (argc < 2)
    {
        fprintf(stderr, "Usage: %s <buffer size>, positive number\\n", argv[0]);
        exit(1);
    }

    i = atoi(argv[1]);

    semid = semget(KEY, 3, 0600 | IPC_CREAT);

    union semun
    {
        int val;
        struct semid_ds *buf;
        ushort *array;
    } arg;

    arg.val = i;
    semctl(semid, EMPTY, SETVAL, arg);
    arg.val = 0;
    semctl(semid, FULL, SETVAL, arg);
    arg.val = 1;
    semctl(semid, MUTEX, SETVAL, arg);

    pid = fork();

    if (pid == 0)
    {
        for (;;)
        {
            sem_wait(semid, EMPTY);
            sem_wait(semid, MUTEX);
            printf("Wrote %d in the buffer\\n", value);
            value++;
            sem_signal(semid, MUTEX);
            sem_signal(semid, FULL);
        }
    }
    else
    {
        for (;;)
        {
            sleep(1);
            sem_wait(semid, FULL);
            sem_wait(semid, MUTEX);
            printf("Read %d from the buffer\\n", value);
            value++;
            sem_signal(semid, MUTEX);
            sem_signal(semid, EMPTY);
        }
    }
}`
  },
  "6": {
    "lru.c": `// lru.c
// Compile: cc lru.c
// Run:     ./a.out

#include <stdio.h>
#include <stdlib.h>

int main()
{
    int i, j, n, rs[50], f[10], nf, k = 0, min;
    int avail, flag[20], pf = 0, next = 1, count[10];

    printf("Enter no of pages\\n");
    scanf("%d", &n);

    printf("Enter the ref string\\n");
    for (i = 1; i <= n; i++)
    {
        scanf("%d", &rs[i]);
        flag[i] = 0;
    }

    printf("Enter frame size\\n");
    scanf("%d", &nf);

    for (i = 0; i < nf; i++)
    {
        count[i] = 0;
        f[i] = -1;
    }

    printf("Page Frames\\n");

    for (i = 1; i <= n; i++)
    {
        flag[i] = 0;

        for (j = 0; j < nf; j++)
        {
            if (f[j] == rs[i])
            {
                flag[i] = 1;
                count[j] = next;
                next++;
            }
        }

        if (flag[i] == 0)
        {
            if (k < nf)
            {
                f[k] = rs[i];
                count[k] = next;
                next++;
                k++;
            }
            else
            {
                min = 0;
                for (j = 1; j < nf; j++)
                    if (count[min] > count[j])
                        min = j;

                f[min] = rs[i];
                count[min] = next;
                next++;
            }
            pf++;
        }

        for (j = 0; j < nf; j++)
            printf("%d\\t", f[j]);

        if (flag[i] == 0)
            printf("pf no is %d", pf);

        printf("\\n");
    }

    printf("No of page faults is %d\\n", pf);
    return 0;
}`,
    "lseekdemo.c": `// lseekdemo.c
// Compile: cc lseekdemo.c
// Run:     ./a.out sample.txt
//
// Create sample.txt first:
//   echo -n "abcdefghijklmnopqrstuvwxyz" > sample.txt

#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>

void main(int argc, char *argv[])
{
    int fd;
    char buff[32];

    fd = open(argv[1], O_RDONLY);

    read(fd, buff, 10);
    write(1, buff, 10);
    printf("\\n");

    lseek(fd, 10, SEEK_SET);
    read(fd, buff, 10);
    write(1, buff, 10);
    printf("\\n");

    lseek(fd, 5, SEEK_CUR);
    read(fd, buff, 10);
    write(1, buff, 10);
    printf("\\n");

    lseek(fd, -6, SEEK_END);
    read(fd, buff, 5);
    write(1, buff, 5);

    close(fd);
}`
  },
  "10": {
    "sjf.c": `// sjf.c
// Compile: cc sjf.c
// Run:     ./a.out

#include <stdio.h>

int main()
{
    int n, bt[20], wt[20], tut[20], twt = 0, ttt = 0, t = 0;

    printf("Enter no. of processes: ");
    scanf("%d", &n);

    printf("Enter burst times: ");
    for (int i = 0; i < n; i++)
        scanf("%d", &bt[i]);

    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (bt[j] < bt[i])
            {
                t = bt[i];
                bt[i] = bt[j];
                bt[j] = t;
            }

    wt[0] = 0;
    for (int i = 1; i < n; i++)
    {
        wt[i] = bt[i - 1] + wt[i - 1];
        twt += wt[i];
    }

    printf("\\nProcess  BurstTime  WaitingTime  TurnAroundTime\\n");
    for (int i = 0; i < n; i++)
    {
        tut[i] = wt[i] + bt[i];
        ttt += tut[i];
        printf("P%d\\t%d\\t%d\\t%d\\n", i + 1, bt[i], wt[i], tut[i]);
    }

    printf("\\nAverage Waiting Time     = %.2f\\n", (float)twt / n);
    printf("Average Turn Around Time = %.2f\\n", (float)ttt / n);

    return 0;
}`,
    "echo_pipe.c": `// echo_pipe.c
// Compile: cc echo_pipe.c
// Run:     ./a.out
//
// The parent writes a message to the pipe, the child reads it and echoes it back.

#include <unistd.h>
#include <stdio.h>
#include <string.h>
#include <sys/wait.h>

int main()
{
    int pipefd[2];
    char buffer[100];
    pid_t pid;
    char message[] = "hello from parent!";

    if (pipe(pipefd) == -1)
    {
        perror("pipe");
        return 1;
    }

    pid = fork();

    if (pid == -1)
    {
        perror("fork");
        return 1;
    }

    if (pid == 0)
    {
        close(pipefd[1]);
        read(pipefd[0], buffer, sizeof(buffer));
        printf("Echo from child: %s\\n", buffer);
        close(pipefd[0]);
    }
    else
    {
        close(pipefd[0]);
        write(pipefd[1], message, strlen(message) + 1);
        printf("Parent sent: %s\\n", message);
        close(pipefd[1]);
        wait(NULL);
    }

    return 0;
}`
  },
  "14": {
    "disksstf.c": `// disksstf.c
// Compile: cc disksstf.c -lm
// Run:     ./a.out

#include <math.h>
#include <stdio.h>
#include <stdlib.h>

int main()
{
    int i, n, k, req[50], mov = 0;
    int cp, index[50], min, a[50], j = 0, mini, cp1;

    printf("Enter the current head position: ");
    scanf("%d", &cp);

    printf("Enter the number of disk requests: ");
    scanf("%d", &n);

    printf("Enter the request queue: ");
    for (i = 0; i < n; i++)
        scanf("%d", &req[i]);

    cp1 = cp;

    for (k = 0; k < n; k++)
    {
        for (i = 0; i < n; i++)
            index[i] = abs(cp - req[i]);

        min  = index[0];
        mini = 0;
        for (i = 1; i < n; i++)
        {
            if (min > index[i])
            {
                min  = index[i];
                mini = i;
            }
        }

        a[j++] = req[mini];
        cp = req[mini];
        req[mini] = 999;
    }

    printf("\\nService Sequence: %d", cp1);
    mov += abs(cp1 - a[0]);
    printf(" -> %d", a[0]);

    for (i = 1; i < n; i++)
    {
        mov += abs(a[i] - a[i - 1]);
        printf(" -> %d", a[i]);
    }

    printf("\\nTotal head movement = %d\\n", mov);
    return 0;
}`,
    "threadparam.c": `// threadparam.c
// Compile: cc threadparam.c -lpthread
// Run:     ./a.out

#include <stdio.h>
#include <pthread.h>
#include <stdlib.h>

struct threadargs
{
    int    id;
    double value;
    char  *message;
};

void *multiple_args_function(void *arg)
{
    struct threadargs *args = (struct threadargs *)arg;
    printf("Thread id: %d, value: %f, message: %s\\n",
           args->id,
           args->value,
           args->message);
    free(args);
    return NULL;
}

int main()
{
    pthread_t tid;

    struct threadargs *args = malloc(sizeof(struct threadargs));
    if (args == NULL)
    {
        perror("failed to allocate memory");
        return 1;
    }

    args->id      = 1;
    args->value   = 3.14;
    args->message = "hello from main thread";

    pthread_create(&tid, NULL, multiple_args_function, (void *)args);
    pthread_join(tid, NULL);

    return 0;
}`
  },
  "18": {
    "npiper.c": `// npiper.c  (Reader / Receiver)
// Compile: cc -o npr npiper.c
// Run in Terminal 2: ./npr

#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <string.h>
#include <unistd.h>

int main()
{
    int  fd;
    char str2[100];

    mkfifo("fifo", 0644);
    printf("Named pipe created\\n");

    while (1)
    {
        fd = open("fifo", O_RDONLY);
        read(fd, str2, sizeof(str2));
        printf("user2 received: %s\\n", str2);
        close(fd);
    }

    return 0;
}`,
    "npipew.c": `// npipew.c  (Writer / Sender)
// Compile: cc -o npw npipew.c
// Run in Terminal 1: ./npw

#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <string.h>
#include <unistd.h>

int main()
{
    int  fd;
    char str1[100];

    mkfifo("fifo", 0644);
    printf("Named pipe created\\n");

    while (1)
    {
        fd = open("fifo", O_WRONLY);
        fgets(str1, 100, stdin);
        write(fd, str1, strlen(str1) + 1);
        close(fd);
        printf("user1 (PID %d) has sent the data\\n", getpid());
    }

    return 0;
}`,
    "roundrobin.c": `// roundrobin.c
// Compile: cc roundrobin.c
// Run:     ./a.out

#include <stdio.h>

int main()
{
    int n, ts, BT[20], wt[20], TAT[20], RT[20];
    int twt = 0, ttat = 0, i, t = 0, count = 0;
    float avgwt, avgTAT;

    printf("Enter the number of processes: ");
    scanf("%d", &n);

    printf("Enter the time quantum (time slice): ");
    scanf("%d", &ts);

    for (i = 1; i <= n; i++)
    {
        printf("Enter burst time of process P%d: ", i);
        scanf("%d", &BT[i]);
        RT[i] = BT[i];
    }

    while (count != n)
    {
        for (i = 1; i <= n; i++)
        {
            if (RT[i] > 0)
            {
                if (RT[i] > ts)
                {
                    RT[i] -= ts;
                    t += ts;
                }
                else
                {
                    t += RT[i];
                    RT[i] = 0;
                    TAT[i] = t;
                    count++;
                }
            }
        }
        if (count == n)
            break;
    }

    for (i = 1; i <= n; i++)
    {
        wt[i]  = TAT[i] - BT[i];
        twt   += wt[i];
        ttat  += TAT[i];
    }

    avgwt  = (float)twt  / n;
    avgTAT = (float)ttat / n;

    printf("\\nProcess  BurstTime  WaitingTime  TurnAroundTime\\n");
    for (i = 1; i <= n; i++)
        printf("P%d\\t%d\\t%d\\t%d\\n", i, BT[i], wt[i], TAT[i]);

    printf("\\nAverage Waiting Time     = %.2f\\n", avgwt);
    printf("Average Turn Around Time = %.2f\\n", avgTAT);

    return 0;
}`
  }
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Match both /set-1 and /1 patterns
    let match = url.pathname.match(/\/set-(\d+)/);
    let matchNum = match ? match[1] : null;
    if (!matchNum) {
      match = url.pathname.match(/(\d+)/);
      matchNum = match ? match[0] : null;
    }

    if (matchNum && sets[matchNum]) {
      let script = `#!/bin/bash
# Script generated by Cloudflare Worker
# To install: curl -sL https://${url.hostname}/${matchNum} | bash

mkdir -p set-${matchNum}
echo "Populating folder set-${matchNum}/..."
`;

      for (const [filename, content] of Object.entries(sets[matchNum])) {
        script += `cat << 'EOF' > set-${matchNum}/${filename}
${content}
EOF
`;
      }

      script += `echo "Successfully downloaded SET-${matchNum}."
echo "Files created:"
ls -F set-${matchNum}/
`;

      return new Response(script, {
        headers: { 
          "content-type": "text/x-shellscript; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const available = Object.keys(sets).sort().join(", ");
    const helpText = `C Program Sets Download Service
==============================
Usage: curl -sL https://${url.hostname}/<set-number> | bash

Available Sets: ${available}

Examples:
  curl -sL https://${url.hostname}/1 | bash
  curl -sL https://${url.hostname}/set-1 | bash
  curl -sL https://${url.hostname}/18 | bash
  curl -sL https://${url.hostname}/set-18 | bash
`;

    return new Response(helpText, {
      status: matchNum ? 404 : 200,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }
};
