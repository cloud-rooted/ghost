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
