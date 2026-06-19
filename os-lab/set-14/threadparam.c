// threadparam.c
// Compile: cc threadparam.c -lpthread
// Run:     ./a.out

#include <stdio.h>
#include <pthread.h>
#include <stdlib.h>

// Structure to pass multiple arguments to thread
struct threadargs
{
    int    id;
    double value;
    char  *message;
};

void *multiple_args_function(void *arg)
{
    struct threadargs *args = (struct threadargs *)arg;
    printf("Thread id: %d, value: %f, message: %s\n",
           args->id,
           args->value,
           args->message);
    free(args);
    return NULL;
}

int main()
{
    pthread_t tid;

    struct threadargs *args = malloc(sizeof(struct threadargs));
    if (args == NULL)
    {
        perror("failed to allocate memory");
        return 1;
    }

    args->id      = 1;
    args->value   = 3.14;
    args->message = "hello from main thread";

    pthread_create(&tid, NULL, multiple_args_function, (void *)args);
    pthread_join(tid, NULL);

    return 0;
}
