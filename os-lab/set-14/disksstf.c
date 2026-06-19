// disksstf.c
// Compile: cc disksstf.c -lm
// Run:     ./a.out

#include <math.h>
#include <stdio.h>
#include <stdlib.h>

int main()
{
    int i, n, k, req[50], mov = 0;
    int cp, index[50], min, a[50], j = 0, mini, cp1;

    printf("Enter the current head position: ");
    scanf("%d", &cp);

    printf("Enter the number of disk requests: ");
    scanf("%d", &n);

    printf("Enter the request queue: ");
    for (i = 0; i < n; i++)
        scanf("%d", &req[i]);

    cp1 = cp;

    // SSTF: always service the request nearest to current head
    for (k = 0; k < n; k++)
    {
        // Compute absolute distances from current position
        for (i = 0; i < n; i++)
            index[i] = abs(cp - req[i]);

        // Find the minimum distance request
        min  = index[0];
        mini = 0;
        for (i = 1; i < n; i++)
        {
            if (min > index[i])
            {
                min  = index[i];
                mini = i;
            }
        }

        a[j++] = req[mini];
        cp = req[mini];
        req[mini] = 999;    // Mark as serviced
    }

    // Print sequence and total head movement
    printf("\nService Sequence: %d", cp1);
    mov += abs(cp1 - a[0]);
    printf(" -> %d", a[0]);

    for (i = 1; i < n; i++)
    {
        mov += abs(a[i] - a[i - 1]);
        printf(" -> %d", a[i]);
    }

    printf("\nTotal head movement = %d\n", mov);
    return 0;
}
