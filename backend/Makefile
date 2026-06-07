dev:
	./mvnw clean compile -DskipTests && ./mvnw spring-boot:run -Pdev

debug:
	./mvnw clean compile -DskipTests && ./mvnw spring-boot:run -Pdev -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"
