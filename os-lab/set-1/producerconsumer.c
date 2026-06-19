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
