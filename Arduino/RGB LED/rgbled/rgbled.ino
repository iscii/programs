#define RED 9
#define GREEN 10
#define BLUE 11

void setup() {
  // put your setup code here, to run once:
  pinMode(RED, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(BLUE, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  // [1,255]
  for(int r=1;r<=255;r++){
    analogWrite(RED, r);
    Serial.println(analogRead(RED));
    delay(1);
  }
  for(int r=255;r>=1;r--){
    analogWrite(RED, r);
    Serial.println(analogRead(RED));
    delay(1);
  }
  for(int g=1;g<=255;g++){
    analogWrite(GREEN, g);
    Serial.println(analogRead(GREEN));
    delay(1);
  }
  for(int g=255;g>=1;g--){
    analogWrite(GREEN, g);
    Serial.println(analogRead(GREEN));
    delay(1);
  }
  for(int b=1;b<=255;b++){
    analogWrite(BLUE, b);
    Serial.println(analogRead(BLUE));
    delay(1);
  }
  for(int b=255;b>=1;b--){
    analogWrite(BLUE, b);
    Serial.println(analogRead(BLUE));
    delay(1);
  }
  Serial.println();
  delay(50);
}
