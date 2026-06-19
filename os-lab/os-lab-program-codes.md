# OS Lab Programs — Set-wise

---

## SET-1

### 1. Program to Demonstrate Orphan Process

```c
// orphan.c
// Compile: cc orphan.c
// Run:     ./a.out

#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

void main()
{
    int pid;
    printf("Demonstration of fork() orphan\n");

    pid = fork();

    if (pid < 0)
    {
        perror("process not created");
        exit(0);
    }
    else if (pid > 0)
    {
        // Parent exits immediately without waiting
        printf("parent process\n");
        printf("from parent pid: %d\n", getpid());
        printf("from parent ppid: %d\n", getppid());
        // Parent exits here — child becomes orphan adopted by init (PID 1)
    }
    else if (pid == 0)
    {
        sleep(1);           // Sleep so parent exits first
        system("ps -l");    // Shows child's new parent is PID 1
        printf("child process\n");
        printf("from child pid: %d\n", getpid());
        printf("from child ppid: %d\n", getppid()); // Will print 1 (init)
    }
}
```

**Expected Output:**
```
Demonstration of fork() orphan
parent process
from parent pid: 2451
from parent ppid: 1890
F S   UID   PID  PPID  C PRI NI ADDR  SZ WCHAN  TTY      TIME CMD
0 S  1020  2452     1  0  80  0    - 642 do_wai pts/0 00:00:00 a.out
child process
from child pid: 2452
from child ppid: 1          <-- adopted by init
```

---

### 2. Program for Producer-Consumer Problem Using Semaphores

```c
// producerconsumer.c
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
#define KEY   50    // Replace with your roll number

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
        fprintf(stderr, "Usage: %s <buffer size>, positive number\n", argv[0]);
        exit(1);
    }

    i = atoi(argv[1]);

    /* Create an array of 3 semaphores */
    semid = semget(KEY, 3, 0600 | IPC_CREAT);

    union semun
    {
        int val;
        struct semid_ds *buf;
        ushort *array;
    } arg;

    /* Set initial semaphore values */
    arg.val = i;
    semctl(semid, EMPTY, SETVAL, arg);  // EMPTY = buffer size
    arg.val = 0;
    semctl(semid, FULL, SETVAL, arg);   // FULL  = 0
    arg.val = 1;
    semctl(semid, MUTEX, SETVAL, arg);  // MUTEX = 1

    pid = fork();

    if (pid == 0)   /* Producer — child process */
    {
        for (;;)
        {
            sem_wait(semid, EMPTY);
            sem_wait(semid, MUTEX);
            printf("Wrote %d in the buffer\n", value);
            value++;
            sem_signal(semid, MUTEX);
            sem_signal(semid, FULL);
        }
    }
    else            /* Consumer — parent process */
    {
        for (;;)
        {
            sleep(1);   // Lazy consumer
            sem_wait(semid, FULL);
            sem_wait(semid, MUTEX);
            printf("Read %d from the buffer\n", value);
            value++;
            sem_signal(semid, MUTEX);
            sem_signal(semid, EMPTY);
        }
    }
}
```

**Expected Output:**
```
Wrote 0 in the buffer
Read 1 from the buffer
Wrote 1 in the buffer
Read 2 from the buffer
Wrote 2 in the buffer
Read 3 from the buffer
...
```

---

## SET-6

### 1. Program to Reposition File Offset Using lseek()

```c
// lseekdemo.c
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

    // Read first 10 bytes from beginning (SEEK_SET position 0)
    read(fd, buff, 10);
    write(1, buff, 10);
    printf("\n");

    // Seek to byte 10 from start, then read 10 bytes
    lseek(fd, 10, SEEK_SET);
    read(fd, buff, 10);
    write(1, buff, 10);
    printf("\n");

    // Seek 5 bytes forward from current position, then read 10 bytes
    lseek(fd, 5, SEEK_CUR);
    read(fd, buff, 10);
    write(1, buff, 10);
    printf("\n");

    // Seek 6 bytes before end, read 5 bytes
    lseek(fd, -6, SEEK_END);
    read(fd, buff, 5);
    write(1, buff, 5);

    close(fd);
}
```

**Expected Output (for "abcdefghijklmnopqrstuvwxyz"):**
```
abcdefghij
klmnopqrst
z
uvwxy
```

---

### 2. Program to Simulate Least Recently Used (LRU) Page Replacement

```c
// lru.c
// Compile: cc lru.c
// Run:     ./a.out

#include <stdio.h>
#include <stdlib.h>

int main()
{
    int i, j, n, rs[50], f[10], nf, k = 0, min;
    int avail, flag[20], pf = 0, next = 1, count[10];

    printf("Enter no of pages\n");
    scanf("%d", &n);

    printf("Enter the ref string\n");
    for (i = 1; i <= n; i++)
    {
        scanf("%d", &rs[i]);
        flag[i] = 0;
    }

    printf("Enter frame size\n");
    scanf("%d", &nf);

    for (i = 0; i < nf; i++)
    {
        count[i] = 0;
        f[i] = -1;
    }

    printf("Page Frames\n");

    for (i = 1; i <= n; i++)
    {
        flag[i] = 0;

        // Check if page already in frame (HIT)
        for (j = 0; j < nf; j++)
        {
            if (f[j] == rs[i])
            {
                flag[i] = 1;
                count[j] = next;
                next++;
            }
        }

        // Page MISS
        if (flag[i] == 0)
        {
            if (k < nf)     // Frames not yet full
            {
                f[k] = rs[i];
                count[k] = next;
                next++;
                k++;
            }
            else            // Replace LRU page
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
            printf("%d\t", f[j]);

        if (flag[i] == 0)
            printf("pf no is %d", pf);

        printf("\n");
    }

    printf("No of page faults is %d\n", pf);
    return 0;
}
```

**Sample Input:**
```
Enter no of pages: 20
Enter the ref string: 7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1
Enter frame size: 3
```

**Expected Output:**
```
7   -1  -1    pf no is 1
7    0  -1    pf no is 2
7    0   1    pf no is 3
2    0   1    pf no is 4
2    0   1
2    0   3    pf no is 5
...
No of page faults is 12
```

---

## SET-10

### 1. Program for Echo Server Using Pipes

```c
// echo_pipe.c
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

    // Create a pipe
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

    if (pid == 0)       /* Child — acts as echo server */
    {
        close(pipefd[1]);                           // Close write end
        read(pipefd[0], buffer, sizeof(buffer));    // Read message
        printf("Echo from child: %s\n", buffer);   // Echo it back
        close(pipefd[0]);
    }
    else                /* Parent — client */
    {
        close(pipefd[0]);                                       // Close read end
        write(pipefd[1], message, strlen(message) + 1);        // Send message
        printf("Parent sent: %s\n", message);
        close(pipefd[1]);
        wait(NULL);
    }

    return 0;
}
```

**Expected Output:**
```
Parent sent: hello from parent!
Echo from child: hello from parent!
```

---

### 2. Program to Simulate Shortest Job First (SJF) CPU Scheduling

```c
// sjf.c
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

    // Sort processes by burst time (selection sort — SJF non-preemptive)
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (bt[j] < bt[i])
            {
                t = bt[i];
                bt[i] = bt[j];
                bt[j] = t;
            }

    // Calculate waiting time
    wt[0] = 0;
    for (int i = 1; i < n; i++)
    {
        wt[i] = bt[i - 1] + wt[i - 1];
        twt += wt[i];
    }

    // Calculate turnaround time
    printf("\nProcess  BurstTime  WaitingTime  TurnAroundTime\n");
    for (int i = 0; i < n; i++)
    {
        tut[i] = wt[i] + bt[i];
        ttt += tut[i];
        printf("P%d\t%d\t%d\t%d\n", i + 1, bt[i], wt[i], tut[i]);
    }

    printf("\nAverage Waiting Time     = %.2f\n", (float)twt / n);
    printf("Average Turn Around Time = %.2f\n", (float)ttt / n);

    return 0;
}
```

**Sample Input & Output:**
```
Enter no. of processes: 5
Enter burst times: 10 5 8 6 2

Process  BurstTime  WaitingTime  TurnAroundTime
P1       2          0            2
P2       5          2            7
P3       6          7            13
P4       8          13           21
P5       10         21           31

Average Waiting Time     = 8.60
Average Turn Around Time = 14.80
```

---

## SET-14

### 1. Program to Demonstrate Parameter Passing in Threads

```c
// threadparam.c
// Compile: cc threadparam.c -lpthread
// Run:     ./a.out

#include <stdio.h>
#include <pthread.h>
#include <stdlib.h>

// Structure to pass multiple arguments to thread
struct threadargs
{
    int    id;
    double value;
    char  *message;
};

void *multiple_args_function(void *arg)
{
    struct threadargs *args = (struct threadargs *)arg;
    printf("Thread id: %d, value: %f, message: %s\n",
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
}
```

**Expected Output:**
```
Thread id: 1, value: 3.140000, message: hello from main thread
```

---

### 2. Program to Demonstrate SSTF Algorithm in Disk Scheduling

```c
// disksstf.c
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

    // SSTF: always service the request nearest to current head
    for (k = 0; k < n; k++)
    {
        // Compute absolute distances from current position
        for (i = 0; i < n; i++)
            index[i] = abs(cp - req[i]);

        // Find the minimum distance request
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
        req[mini] = 999;    // Mark as serviced
    }

    // Print sequence and total head movement
    printf("\nService Sequence: %d", cp1);
    mov += abs(cp1 - a[0]);
    printf(" -> %d", a[0]);

    for (i = 1; i < n; i++)
    {
        mov += abs(a[i] - a[i - 1]);
        printf(" -> %d", a[i]);
    }

    printf("\nTotal head movement = %d\n", mov);
    return 0;
}
```

**Sample Input & Output:**
```
Enter the current head position: 53
Enter the number of disk requests: 8
Enter the request queue: 98 183 37 122 14 124 65 67

Service Sequence: 53 -> 65 -> 67 -> 37 -> 14 -> 98 -> 122 -> 124 -> 183
Total head movement = 236
```

---

## SET-18

### 1. Program to Demonstrate Round Robin CPU Scheduling

```c
// roundrobin.c
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
        RT[i] = BT[i];      // Remaining time = burst time initially
    }

    // Simulate Round Robin
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

    // Compute waiting time and averages
    for (i = 1; i <= n; i++)
    {
        wt[i]  = TAT[i] - BT[i];
        twt   += wt[i];
        ttat  += TAT[i];
    }

    avgwt  = (float)twt  / n;
    avgTAT = (float)ttat / n;

    printf("\nProcess  BurstTime  WaitingTime  TurnAroundTime\n");
    for (i = 1; i <= n; i++)
        printf("P%d\t%d\t%d\t%d\n", i, BT[i], wt[i], TAT[i]);

    printf("\nAverage Waiting Time     = %.2f\n", avgwt);
    printf("Average Turn Around Time = %.2f\n", avgTAT);

    return 0;
}
```

**Sample Input & Output:**
```
Enter the number of processes: 4
Enter the time quantum: 2
Enter burst time of P1: 5
Enter burst time of P2: 4
Enter burst time of P3: 2
Enter burst time of P4: 7

Process  BurstTime  WaitingTime  TurnAroundTime
P1       5          6            11
P2       4          8            12
P3       2          4             6
P4       7         11            18

Average Waiting Time     = 7.25
Average Turn Around Time = 11.75
```

---

### 2. Program to Demonstrate Named Pipes (FIFO)

Named pipes require **two separate programs** run in two terminals.

**Writer Program — `npipew.c`**

```c
// npipew.c  (Writer / Sender)
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

    // Create the named pipe (FIFO)
    mkfifo("fifo", 0644);
    printf("Named pipe created\n");

    while (1)
    {
        fd = open("fifo", O_WRONLY);    // Open for writing
        fgets(str1, 100, stdin);        // Read input from keyboard
        write(fd, str1, strlen(str1) + 1);
        close(fd);
        printf("user1 (PID %d) has sent the data\n", getpid());
    }

    return 0;
}
```

**Reader Program — `npiper.c`**

```c
// npiper.c  (Reader / Receiver)
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

    // Create/open the named pipe
    mkfifo("fifo", 0644);
    printf("Named pipe created\n");

    while (1)
    {
        fd = open("fifo", O_RDONLY);    // Open for reading
        read(fd, str2, sizeof(str2));
        printf("user2 received: %s\n", str2);
        close(fd);
    }

    return 0;
}
```

**How to Run:**
```
# Terminal 1 (Writer):
cc -o npw npipew.c
./npw
named pipe created
Hello
user1 (PID 2451) has sent the data
Operating Systems
user1 (PID 2451) has sent the data

# Terminal 2 (Reader):
cc -o npr npiper.c
./npr
named pipe created
user2 received: Hello
user2 received: Operating Systems
```

---

## Compilation Summary

| Set | Program | Compile Command |
|-----|---------|----------------|
| SET-1 | Orphan Process | `cc orphan.c` |
| SET-1 | Producer-Consumer | `cc producerconsumer.c` |
| SET-6 | lseek Demo | `cc lseekdemo.c` |
| SET-6 | LRU Page Replacement | `cc lru.c` |
| SET-10 | Echo Server (Pipes) | `cc echo_pipe.c` |
| SET-10 | SJF Scheduling | `cc sjf.c` |
| SET-14 | Thread Parameter Passing | `cc threadparam.c -lpthread` |
| SET-14 | SSTF Disk Scheduling | `cc disksstf.c -lm` |
| SET-18 | Round Robin Scheduling | `cc roundrobin.c` |
| SET-18 | Named Pipes (Writer) | `cc -o npw npipew.c` |
| SET-18 | Named Pipes (Reader) | `cc -o npr npiper.c` |