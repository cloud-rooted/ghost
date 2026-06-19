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
