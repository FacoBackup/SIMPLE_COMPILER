export default `10 input n
15 if n < 0 goto 45
20 let f = 1
25 if n < 2 goto 50
30 if n <= 2 goto 50
35 if n >= 2 goto 50
40 if n != 2 goto 50
45 let f = f * n
50 let n = n - 1
55 goto 25
60 let f = -1
65 print f
65 end `
