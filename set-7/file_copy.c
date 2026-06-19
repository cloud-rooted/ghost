#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>

#define BUFFER_SIZE 1024

int main(int argc, char *argv[]) {
    int src_fd, dst_fd;
    ssize_t n_read;
    char buffer[BUFFER_SIZE];

    if (argc != 3) {
        fprintf(stderr, "Usage: %s <source> <destination>\n", argv[0]);
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

    printf("File copied successfully using system calls.\n");

    close(src_fd);
    close(dst_fd);
    return 0;
}
