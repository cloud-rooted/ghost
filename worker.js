/**
 * Cloudflare Worker to serve C program sets via curl.
 * Usage: 
 *   curl -sL https://your-worker.workers.dev/3 | bash
 *   curl -sL https://your-worker.workers.dev/set-11 | bash
 */

const sets = {
  "3": {
    "file_copy.c": `#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    FILE *src, *dst;
    char ch;

    if (argc != 3) {
        printf("Usage: %s <source_file> <dest_file>\\n", argv[0]);
        exit(1);
    }

    src = fopen(argv[1], "r");
    if (src == NULL) {
        perror("Error opening source file");
        exit(1);
    }

    dst = fopen(argv[2], "w");
    if (dst == NULL) {
        fclose(src);
        perror("Error opening destination file");
        exit(1);
    }

    while ((ch = fgetc(src)) != EOF) {
        fputc(ch, dst);
    }

    printf("File copied successfully.\\n");

    fclose(src);
    fclose(dst);
    return 0;
}`,
    "fcfs.c": `#include <stdio.h>

struct Process {
    int pid;
    int bt; // Burst Time
    int wt; // Waiting Time
    int tat; // Turnaround Time
};

void calculateTimes(struct Process p[], int n) {
    p[0].wt = 0;
    p[0].tat = p[0].bt;

    for (int i = 1; i < n; i++) {
        p[i].wt = p[i-1].wt + p[i-1].bt;
        p[i].tat = p[i].wt + p[i].bt;
    }
}

int main() {
    int n;
    printf("Enter number of processes: ");
    scanf("%d", &n);

    struct Process p[n];
    for (int i = 0; i < n; i++) {
        p[i].pid = i + 1;
        printf("Enter burst time for P%d: ", p[i].pid);
        scanf("%d", &p[i].bt);
    }

    calculateTimes(p, n);

    float avg_wt = 0, avg_tat = 0;
    printf("\\nPID\\tBT\\tWT\\tTAT\\n");
    for (int i = 0; i < n; i++) {
        avg_wt += p[i].wt;
        avg_tat += p[i].tat;
        printf("%d\\t%d\\t%d\\t%d\\n", p[i].pid, p[i].bt, p[i].wt, p[i].tat);
    }

    printf("\\nAverage Waiting Time: %.2f", avg_wt / n);
    printf("\\nAverage Turnaround Time: %.2f\\n", avg_tat / n);

    return 0;
}`
  },
  "7": {
    "file_copy.c": `#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>

#define BUFFER_SIZE 1024

int main(int argc, char *argv[]) {
    int src_fd, dst_fd;
    ssize_t n_read;
    char buffer[BUFFER_SIZE];

    if (argc != 3) {
        fprintf(stderr, "Usage: %s <source> <destination>\\n", argv[0]);
        exit(1);
    }

    src_fd = open(argv[1], O_RDONLY);
    if (src_fd == -1) {
        perror("Error opening source file");
        exit(1);
    }

    dst_fd = open(argv[2], O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (dst_fd == -1) {
        perror("Error creating destination file");
        close(src_fd);
        exit(1);
    }

    while ((n_read = read(src_fd, buffer, BUFFER_SIZE)) > 0) {
        if (write(dst_fd, buffer, n_read) != n_read) {
            perror("Error writing to destination file");
            close(src_fd);
            close(dst_fd);
            exit(1);
        }
    }

    printf("File copied successfully using system calls.\\n");

    close(src_fd);
    close(dst_fd);
    return 0;
}`,
    "fork_demo.c": `#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>

int main() {
    pid_t pid;

    pid = fork();

    if (pid < 0) {
        fprintf(stderr, "Fork failed\\n");
        return 1;
    } else if (pid == 0) {
        // Child process
        printf("I am the child process. PID: %d, Parent PID: %d\\n", getpid(), getppid());
    } else {
        // Parent process
        printf("I am the parent process. PID: %d, Child PID: %d\\n", getpid(), pid);
    }

    return 0;
}`
  },
  "11": {
    "shm_demo.c": `#include <stdio.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <string.h>
#include <unistd.h>

int main() {
    // Using "." as the path for ftok ensures it works in any directory
    key_t key = ftok(".", 65);
    int shmid = shmget(key, 1024, 0666 | IPC_CREAT);
    char *str = (char*) shmat(shmid, (void*)0, 0);

    if (fork() == 0) {
        // Child process: writes to shared memory
        printf("Child: Writing to shared memory...\\n");
        strcpy(str, "Hello from shared memory!");
        shmdt(str);
    } else {
        // Parent process: reads from shared memory
        sleep(1); // Wait for child to write
        printf("Parent: Read from shared memory: %s\\n", str);
        shmdt(str);
        shmctl(shmid, IPC_RMID, NULL); // Destroy shared memory
    }

    return 0;
}`,
    "dining_philosophers.c": `#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define N 5
sem_t forks[N];

void* philosopher(void* num) {
    int id = *(int*)num;
    printf("Philosopher %d is thinking\\n", id);

    sem_wait(&forks[id]);
    sem_wait(&forks[(id + 1) % N]);

    printf("Philosopher %d is eating\\n", id);
    sleep(1);

    sem_post(&forks[id]);
    sem_post(&forks[(id + 1) % N]);

    printf("Philosopher %d finished eating\\n", id);
    return NULL;
}

int main() {
    pthread_t threads[N];
    int ids[N];

    for (int i = 0; i < N; i++) sem_init(&forks[i], 0, 1);

    for (int i = 0; i < N; i++) {
        ids[i] = i;
        pthread_create(&threads[i], NULL, philosopher, &ids[i]);
    }

    for (int i = 0; i < N; i++) pthread_join(threads[i], NULL);
    for (int i = 0; i < N; i++) sem_destroy(&forks[i]);

    return 0;
}`
  },
  "15": {
    "ls_sim.c": `#include <stdio.h>
#include <dirent.h>

int main(int argc, char *argv[]) {
    struct dirent *de;
    DIR *dr = opendir(argc > 1 ? argv[1] : ".");

    if (dr == NULL) {
        printf("Could not open directory\\n");
        return 0;
    }

    while ((de = readdir(dr)) != NULL) {
        printf("%s\\n", de->d_name);
    }

    closedir(dr);
    return 0;
}`,
    "named_pipes.c": `#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

int main() {
    int fd;
    char *myfifo = "/tmp/myfifo";
    mkfifo(myfifo, 0666);

    char arr1[80], arr2[80];
    if (fork() == 0) {
        // Child: Writer
        fd = open(myfifo, O_WRONLY);
        strcpy(arr1, "Hello through FIFO");
        write(fd, arr1, strlen(arr1) + 1);
        close(fd);
    } else {
        // Parent: Reader
        fd = open(myfifo, O_RDONLY);
        read(fd, arr2, sizeof(arr2));
        printf("Parent received: %s\\n", arr2);
        close(fd);
        unlink(myfifo);
    }
    return 0;
}`
  }
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Fix: Using single backslash for regex digit class
    const match = url.pathname.match(/\d+/);
    const setNum = match ? match[0] : null;

    if (setNum && sets[setNum]) {
      // Fix: Removing backslashes from variable interpolation ${}
      let script = `#!/bin/bash
# Script generated by Cloudflare Worker
# To install: curl -sL https://${url.hostname}/${setNum} | bash

mkdir -p set-${setNum}
echo "Populating folder set-${setNum}/..."
`;

      for (const [filename, content] of Object.entries(sets[setNum])) {
        // Fix: Ensuring filename and content are correctly interpolated
        script += `cat << 'EOF' > set-${setNum}/${filename}
${content}
EOF
`;
      }

      script += `echo "Successfully downloaded SET-${setNum}."
echo "Files created:"
ls -F set-${setNum}/
`;

      return new Response(script, {
        headers: { 
          "content-type": "text/x-shellscript; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const available = Object.keys(sets).join(", ");
    const helpText = `C Program Sets Download Service
==============================
Usage: curl -sL https://${url.hostname}/<set-number> | bash

Available Sets: ${available}

Example:
  curl -sL https://${url.hostname}/3 | bash
  curl -sL https://${url.hostname}/set-11 | bash
`;

    return new Response(helpText, {
      status: setNum ? 404 : 200,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }
};
