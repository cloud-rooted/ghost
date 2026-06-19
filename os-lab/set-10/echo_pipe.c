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
