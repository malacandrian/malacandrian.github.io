---
title: Abstract Evolutions
image: robocode.jpg
---
[View on Github](https://github.com/malacandrian/AbstractEvolutions) [View on NuGet](https://www.nuget.org/packages/AbstractEvolutions/)

Abstract Evolutions is a framework for generating & evolving genetic algorithms for [Robocode.NET](http://robowiki.net/). It builds on the existing Robocode automation framework, providing abstract classes to define the genomes & evolutionary strategies, as well as all of the logic required to test and breed the robots over an arbitrary number of generations.

The logic is divided across three main classes

* [`EvolutionEnvironment`](https://github.com/malacandrian/AbstractEvolutions/blob/master/AbstractEvolutions/EvolutionEnvironment.cs)

     This handles the logic of actually battling the robots against each other. It manages the Robocode automation API, and all of the populations, selecting a set of robots for each battle, and reporting the scores to all the populations.

     All the logic here is already implemented, just create an instance of it in your program, add all the populations to it, and set it off.
* [`AbstractPopulation`](https://github.com/malacandrian/AbstractEvolutions/blob/master/AbstractEvolutions/AbstractPopulation.cs)

    Extend this class to house your evolutionary strategy: choose which robots to carry forward, evolve, or kill each generation. Alternatively, you can implement the [`IPopulation`](https://github.com/malacandrian/AbstractEvolutions/blob/master/AbstractEvolutions/IPopulation.cs) interface.

 * [`AbstractRobotEvolution`](https://github.com/malacandrian/AbstractEvolutions/blob/master/AbstractEvolutions/AbstractRobotEvoloution.cs)

     Extend this class to house the genome, along with the logic for converting it to a phenome and how the robot breeds with another robot. Alternatively, you can implement the [`IRobotEvolution`](https://github.com/malacandrian/AbstractEvolutions/blob/master/AbstractEvolutions/IRobotEvolution.cs) interface.

Additionally, an example project is provided to show how the library can be used.

Abstract Evolutions was originally written for a university project on genetic algorithms. [A report on the evolved robots' success is available here](/resources/files/KillerRobots.pdf).
