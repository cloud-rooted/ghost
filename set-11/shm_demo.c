#include <stdio.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <string.h>
#include <unistd.h>

int main() {
    key_t key = ftok("shmfile", 65);
    int shmid = shmget(key, 1024, 0666 | IPC_CREAT);
    char *str = (char*) shmat(shmid, (void*)0, 0);

    if (fork() == 0) {
        // Child process: writes to shared memory
        printf("Child: Writing to shared memory...\n");
        strcpy(str, "Hello from shared memory!");
        shmdt(str);
    } else {
        // Parent process: reads from shared memory
        sleep(1); // Wait for child to write
        printf("Parent: Read from shared memory: %s\n", str);
        shmdt(str);
        shmctl(shmid, IPC_RMID, NULL); // Destroy shared memory
    }

    return 0;
}
