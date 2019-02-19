# General-AI

![screenshot](https://ibb.co/4sdG0Zy)

This is an experiment in genetic programming (https://en.wikipedia.org/wiki/Genetic_programming), written in vanilla JavaScript. The user can input any list of integers and the program will attempt to write a JavaScript program that outputs that list.

## How it works:

Initially, the program generates several hundred randomly generated abstract syntax trees (ASTs), which consist of several randomly selected statements at the top level, and trees of randomly selected expressions as the arguments to the statements. Each of these abstract syntax trees is then converted into a JavaScript program and evaluated. If the program doesn't produce an error, it's output is fed into a fitness function which compares the output to the desired output. The ASTs with the highest fitness score are permitted to live on to the next generation. Each AST reproduces 20 times, and each child AST is mutated randomly, and then evaluted. The process repeats until the AST population converges on an solution, or get stuck in a local minima with a nearly correct solution.

## Features to be added:

- fitness function which takes coding style and category of algorithm into account
- genetic cross-over between programs
- prevent program from getting stuck in local minimum, perhaps by increasing mutation rate if there is no increase in fitness for several generations, or by adding new seed programs to the population each generation
