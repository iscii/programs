#include <Servo.h>

int buttonPin = 7;
int ledPin = 2;
void setup() {
  // put your setup code here, to run once:
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  if(digitalRead(buttonPin) == LOW){
    digitalWrite(ledPin, HIGH);
  }
  else digitalWrite(ledPin, LOW);
  Serial.println(digitalRead(7));
  //delay(100);
}
