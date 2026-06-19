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
