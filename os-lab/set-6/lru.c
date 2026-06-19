// lru.c
// Compile: cc lru.c
// Run:     ./a.out

#include <stdio.h>
#include <stdlib.h>

int main()
{
    int i, j, n, rs[50], f[10], nf, k = 0, min;
    int avail, flag[20], pf = 0, next = 1, count[10];

    printf("Enter no of pages\n");
    scanf("%d", &n);

    printf("Enter the ref string\n");
    for (i = 1; i <= n; i++)
    {
        scanf("%d", &rs[i]);
        flag[i] = 0;
    }

    printf("Enter frame size\n");
    scanf("%d", &nf);

    for (i = 0; i < nf; i++)
    {
        count[i] = 0;
        f[i] = -1;
    }

    printf("Page Frames\n");

    for (i = 1; i <= n; i++)
    {
        flag[i] = 0;

        // Check if page already in frame (HIT)
        for (j = 0; j < nf; j++)
        {
            if (f[j] == rs[i])
            {
                flag[i] = 1;
                count[j] = next;
                next++;
            }
        }

        // Page MISS
        if (flag[i] == 0)
        {
            if (k < nf)     // Frames not yet full
            {
                f[k] = rs[i];
                count[k] = next;
                next++;
                k++;
            }
            else            // Replace LRU page
            {
                min = 0;
                for (j = 1; j < nf; j++)
                    if (count[min] > count[j])
                        min = j;

                f[min] = rs[i];
                count[min] = next;
                next++;
            }
            pf++;
        }

        for (j = 0; j < nf; j++)
            printf("%d\t", f[j]);

        if (flag[i] == 0)
            printf("pf no is %d", pf);

        printf("\n");
    }

    printf("No of page faults is %d\n", pf);
    return 0;
}
