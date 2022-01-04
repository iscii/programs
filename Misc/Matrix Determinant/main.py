# https://semath.info/src/determinant-five-by-five.html

def big_determinant(matrix):
    determinant = 0

    det_m = []
    coeff = []
    sign = 1
    yidx = 0

    #break loop into len-1 matrix
    for xidx in range (len(matrix)):
        coeff.append(matrix[yidx][xidx] * sign)
        sign *= -1
        med_m = [] 
        for r in range (len(matrix)): #row
            if(r == yidx): #skip r at 0
                continue
            for c in range (len(matrix[r])): #column
                if(c == xidx): #skip c at xidx
                    continue
                smol_m = []
                for i in range (len(matrix[r])):
                    if (i == xidx): #skip item at xidx
                        continue
                    smol_m.append(matrix[r][i])
            med_m.append(smol_m)
        det_m.append(med_m)

    # find determinant for m len > 2
    if(len(matrix) > 2):
        for i in range (len(coeff)):
            determinant += coeff[i]*big_determinant(det_m[i])
    else:
        for i in range (len(coeff)):
            determinant += coeff[i]*det_m[i][0][0]

    # print
    for i in range (len(matrix)):
        print(matrix[i])
    print(coeff)
    for i in range (len(det_m)):
        print(det_m[i])

    print(determinant)
    return determinant

#tests; checked with symbolab

m2 = [[11,12],[21,22]]
m3 = [[11,12,13],[21,22,23],[31,32,33]]
m4 = [[11,12,13,14],[21,22,23,24],[31,32,33,34],[41,42,43,44]]
m5 = [[11,12,13,14,15],[21,22,23,24,25],[31,32,33,34,35],[41,42,43,44,45],[51,52,53,54,55]]
#print(big_determinant(m2)) = -10 CHECK 
#print(big_determinant(m3)) = 0 CHECK 
#print(big_determinant(m4)) = 0 CHECK 
#print(big_determinant(m5)) = 0 CHECK 

mr = [[2, 5, 5, 7, 3], [3, 2, 1, 8, 9], [5, 3, 4, 3, 7], [3, 8, 8, 0, 2], [2, 5, 9, 4, 9]]
#print(big_determinant(mr)) = 5173 CHECK