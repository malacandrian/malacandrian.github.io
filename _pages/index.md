---
  layout: main
---
<a id="About" />

## About Me

I’m Evan Williams. I'm a Norfolk-based engineer, working in software, electronics, and refrigeration systems (FGAS Registered). I have worked in both technical and people-focused roles, and have degrees in both Computer Science from [The University of Reading](https://www.reading.ac.uk/) and Theology from [Union School of Theology](https://www.ust.ac.uk). I think analytically, learn quickly, and work creatively. 

On the desktop I enjoy working within the [DotNet](https://dot.net) ecosystem. Most of my work is done in C# using WPF for frontends, and I have used F# to develop sub-components where appropriate. For embedded development I have experience using C for the [Microchip XC8 and XC16 compilers](https://www.microchip.com/en-us/tools-resources/develop/mplab-xc-compilers), but I am keeping a keen eye on the progress of [Wilderness Lab's Meadow](https://www.wildernesslabs.co/hardware) platform that promises to bring DotNet to the embedded space. I also have experience with both [Easy-PC](https://www.numberone.com/) and [KiCad](https://www.kicad.org/) PCB CAD packages; using them to capture parts and schematics, and lay out PCB designs for manufacture.

Outside of work I am a member of my local church, volunteering my talents where they are needed. I enjoy cooking, cycling around the brilliant Norfolk countryside, and playing board or role-playing games with my friends.

**Evan**

<a id="Projects" />

## Projects

These are a few of the projects that I've worked on recently and am particularly proud of.

<a id="API" />

### API for CAN Dashboards

I do a lot of work on systems that communicate over the CAN bus. e.g. a distributed HVAC system that monitors the climate in multiple chambers, and controls it through the combined action of different heating, chilling, and air-handling units. When developing these systems, easily and clearly monitoring the current state of each of the nodes is vital; as is generating sample inputs to test each node in isolation under a full range of scenarios. When it became clear that this was a problem that needed to be solved over and over, I developed an API that allows us to quickly and inexpensively develop these dashboards.

There are several interesting features of the API.

#### Using CAN Dongles From Multiple Vendors
The dashboards are not tied to a single vendor's API. Instead, modules can be created to connect the dashboards (or other software built on the same core, e.g. the [bootloader](#Bootloader)) to any CAN dongle. To date, I have created modules for [PCAN Basic](https://www.peak-system.com/PCAN-Basic.239.0.html?&L=1), [USB-Tin](https://www.fischl.de/usbtin/), and my company's own proprietary dongle.

#### Sharing a Single CAN Dongle Across Apps
Due to hardware limitations, most CAN dongles can only talk to a single process at once. For example the [USB-Tin](https://www.fischl.de/usbtin/) uses a virtual COM Port to handle communication, which can only be opened in a single process. My API allows the hardware resource to be shared between processes. This allows multiple programs to all send and receive messages from both the CAN dongle, and from each other. In theory this could be extended over a TCP/IP network to allow multiple computers to access a single physical CAN resource.

#### Interpreting Multiple CAN Signal Encodings
There are multiple schemes for encoding data into a CAN message. They vary in expected ways, such as the endianness of a multi-byte message; but also in surprising ways such as the correct ordering of bits within a byte or the bytes within message. Hugo Provencher covers this subject well in chapter 9 of his [in-depth analysis of CAN networks](https://hugoprovencher.com/files/2015/07/DirectedStudies_HugoProvencher.pdf). 

To summarise, there are six main arrangements to be considered: Intel Standard, Intel Sequential, Motorola Forward LSB, Motorola Forward MSB, Motorola Backward, and Motorola Sequential. A 10-bit signal starting at bit 23 of an 8-byte message would be located in the following position for each encoding:

<img class="bitfield" src="/resources/Intel%20Standard.svg" /> <img class="bitfield" src="/resources/Intel%20Sequential.svg" /> <img class="bitfield" src="/resources/Motorola%20Forward%20LSB.svg" /> <img class="bitfield" src="/resources/Motorola%20Forward%20MSB.svg" /> <img class="bitfield" src="/resources/Motorola%20Backward.svg" /> <img class="bitfield" src="/resources/Motorola%20Sequential.svg" />

A signal defined by start position and length in one standard may be non-contiguous if transferred to another. Therefore, a function is needed for each encoding. The transfer function takes the full message, the start position, and the length as inputs, and returns a sequence of bits as the output, standardised such that the sequence begins with the LSB and ends with the MSB. This sequence can then be deserialised into a meaningful domain value (e.g. translated to an enumeration, or having an affine transformation applied to it) for the model and then rendered into a string for the view model.

<a id="Bootloader" />

### CAN Bootloader

I was a part of a team that developed a bootloader that communicates over the CAN bus. The bootloader can reprogram [Microchip PIC](https://www.microchip.com/en-us/products/microcontrollers-and-microprocessors) chips in the 16F, 18F, and dsPic families; as well as [4D Systems Displays](https://4dsystems.com.au/). It is also has a pass-through mode, allowing devices connected to a secondary network (whether a second CAN bus, or a LIN bus) to be reprogrammed indirectly.

I was responsible for the PC-based host software. It has four main components:
1. A parser (built using FParsec in F#) that creates a memory model from the `.hex` binary files.
2. A package manager that automatically selects the appropriate binary to load based on the reported hardware version of the device.
3. A protocol handler that manages the communications
4. A front end created using WPF

The feature I am most proud of is in the protocol handler: I was able to create a custom awaitable that checked incoming CAN messages for valid ACKs, NAKs, or replies to the sent messages (as appropriate). With this awaitable the code for each method of the protocol handler can then be written as a linear progression of logical steps, rather than intermingling the business logic with a complex state machine that gets called every time a message is received. 

I am currently in the process of rewriting the protocol handler and front end in F# using [Elmish.WPF](https://github.com/elmish/Elmish.WPF).

<a id="4D" />

### 4D Display Loader

There are several projects in which we use [4D Systems Displays](https://4dsystems.com.au/). These include military and marine HVAC systems, and vehicle dashboards. The display expects most image assets to be loaded onto SD cards and inserted into the display, but this does not work for our applications. First, the SD holder would not stand up to the G-force requirements of the devices. Second, the SD card is difficult to reprogram in the field, as the device needs to be opened to gain access to the SD card holder. Instead we convert the image assets into 4DGL code files and save them directly to the flash banks of the display.

4D systems recommend a slow, manual process that involves multiple tools for doing this. To streamline this, as well as adding extra functionality; I created a PowerShell 7 module in C# that can output 4DGL code files that contain image assets, colour pallets, on-screen locations, and more.

I chose to create it as a PowerShell module because I wanted the export to be an automatable process, and PowerShell gave me an expressive language for building custom configurations for each application.