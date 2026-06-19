#include <stdio.h>
#include <dirent.h>

int main(int argc, char *argv[]) {
    struct dirent *de;
    DIR *dr = opendir(argc > 1 ? argv[1] : ".");

    if (dr == NULL) {
        printf("Could not open directory\n");
        return 0;
    }

    while ((de = readdir(dr)) != NULL) {
        printf("%s\n", de->d_name);
    }

    closedir(dr);
    return 0;
}
