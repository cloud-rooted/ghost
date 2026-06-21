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
        printf("\n");
        system("ps -l");    // Shows child's new parent is PID 1
        printf("child process\n");
        printf("from child pid: %d\n", getpid());
        printf("from child ppid: %d\n", getppid()); // Will print 1 (init)
    }
}
