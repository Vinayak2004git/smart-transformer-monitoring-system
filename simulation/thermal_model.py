import time

# Initial conditions
ambient_temp = 30        # °C (room/environment temperature)
transformer_temp = 60    # °C (normal operating temp)

# Load settings
I_rated = 10             # A (rated current)
I_current = 15          # A (overload example)

# Thermal constants (tunable, but realistic)
heating_constant = 0.5
cooling_constant = 0.01

print("Time(s)\tTemperature(°C)\tStatus")

for t in range(1, 61):   # simulate 60 seconds
    # Heating ∝ (I / I_rated)^2
    heating = heating_constant * (I_current / I_rated) ** 2

    # Cooling depends on temperature difference
    cooling = cooling_constant * (transformer_temp - ambient_temp)

    # Update temperature
    transformer_temp = transformer_temp + heating - cooling

    # Condition monitoring
    if transformer_temp > 90:
        status = "OVERHEATING ⚠️"
    else:
        status = "NORMAL"

    print(f"{t}\t\t{transformer_temp:.2f}\t\t{status}")
    time.sleep(0.2)
