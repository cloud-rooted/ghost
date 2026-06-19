#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    FILE *src, *dst;
    char ch;

    if (argc != 3) {
        printf("Usage: %s <source_file> <dest_file>\n", argv[0]);
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

    printf("File copied successfully.\n");

    fclose(src);
    fclose(dst);
    return 0;
}
