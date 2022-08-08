# EmbeddedEngineerTest_Labfoward
this is a test for the embedded engineer postion at Labfoaward
## Scope and Time 
as you know i've been given 10 days to complte the tasks but as we spoke in the interview and you're awre of my situation.
I have chosen to work on this test during the weekend so i would say that it took me roughly 6 to 7 hours to complete 
which is a little bit more than the the hours mentionned in the document 
but to be fairly honest it's been a few months since my last project in JavaScript as you know. 
## Global archtecture : 
the project represents 2 NodeJs Processes runinng on the same machine (windows) 
one represents the Iot Driver (responsible for Command sending And Data Routing ...)
and the other represts a simulation of a an Iot Device or a Scienific instrument which is in this case a high precision Balance
these 2 process communicate either via MQTT protocol or Serial Communication (depending on the Interface available) 
## prerequisites 
### Virtual Port :
To be able to use the Serial Communication , A virtual srial Port must be created by connecting 2 Com ports for example COM1 <=> COM2 (which are Used in this project)
### CommandLine
the terminal will be used for User Input for Sending the Commands through the Iot Driver , below a list of All the Commands posssible : 
### Launch 
to launch the processes it would be best to run to differnt cmdlines one for IotDriver and the other for the Scientific instrument 
make sure to run "npm start" the first time for both modules to be ble to download the dependencies 
with each module there is ".env" file defining global variables for each process or device thes variables can be updated directly or with Commands from the Iot Driver below : 
### Commands
To be able to communicate and send commands :
                    "the following commands are set for use :
                    "S --------------------------------------> to get the stable weight calculated by the device
                    "G --------------------------------------> to get the Current weight calculated by the device
                    "BConf ----------------------------------> to get the Current config details of the device
                    "C other.Device_Name name ---------------> the change the device name
                    "C link link link ----------------------->  to set which link the driver should use to connect to the device , link can be Serial or MQTT
                    "C mqtt.broker : broker ----------------->  to set the mqtt host : usually local host unless the solution is set on containers or online
                    "C mqtt.username usrname ----------------> to set the username for device authentication
                    "C mqtt.password pwd --------------------> to set the password for device authentication
                    "C serial.path path ---------------------> COMx on windows for this project a virtual com port COM1 and COM2 are being used
                    "C serial.baudRate bd -------------------> to set the serial port BaudRate
                    "C serial.parity parity -----------------> to set the serial port parity 
                    "C measurement.READ_INTERVAL T (in ms) --> to set how many data points the sensor per T collects to calculate the stable weight
                    "C measurement.PERIODIC_MEASUREMENTS x --> (true or false) to set a function that sends data periodically to the iot driver
                    "C measurement.unit ---------------------> (mg or g) : to set the unit in which the sensor value is sent to the driver
                    "IN ORDER TO HAVE THE Config COMMANDS Done you have to Restart the device Process
 ## NPM Packages 
 in this test serial-port has been used to create the serial communication
 aedes has been used to create the MQTT broker (IoT Driver) 
 mqtt has been used to manage the mqtt client side (the Balance)
 readline is used to create the user input and interaction 
 pino has been used to create better Data and event Logging 
 ## improvemnt points 
 a few points that i would think would've been good to improve are : 
 - adding Docker Containers for each process 
 - testing multiple devices (Balance)
 - improvng the Communication abstraction layer (codewise) which seperates the communication from the type of interface (on both the driver and the device)
 - implementing better UI 
 - adding tls to the mqtt broker for security 
 - better strutring the Commands syntax and protocol betweeen the device and the driver
 ## thank you for considering for the position i must say i had fun doing this test as it kinda made me remember why i chose to specialize in IOT in the first place and I hope I talk to you soon :) 
