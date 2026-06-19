#include <stdio.h>
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
        printf("Parent received: %s\n", arr2);
        close(fd);
        unlink(myfifo);
    }
    return 0;
}
