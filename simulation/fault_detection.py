import time

# -------------------------
# Fixed transformer constants
# -------------------------
ambient_temp = 30
transformer_temp = 60

I_rated = 10          # A
I_current = 12        # A (try 10, 12, 15)

heating_constant = 0.5
cooling_constant = 0.01

SAFE_TEMP = 90        # °C

print("Time(s)\tTemp(°C)\tCurrent(A)\tStatus")

for t in range(1, 61):

    # Heating (I² law)
    heating = heating_constant * (I_current / I_rated) ** 2
    cooling = cooling_constant * (transformer_temp - ambient_temp)

    transformer_temp = transformer_temp + heating - cooling

    # -------------------------
    # Fault classification logic
    # -------------------------
    if transformer_temp > SAFE_TEMP:
        status = "CRITICAL – OVERHEATING 🔥"
    elif I_current > I_rated:
        status = "WARNING – OVERLOAD ⚠️"
    else:
        status = "NORMAL ✅"

    print(f"{t}\t\t{transformer_temp:.2f}\t\t{I_current}\t\t{status}")
    time.sleep(0.2)
