from app.services.fuel_service import get_fuel_status


print("\n===== MAWSON FUEL STATUS =====")

result = get_fuel_status()

print(
    "Latest date:",
    result["latestDate"]
)

print(
    "Latest monthly fuel:",
    result["latestMonthlyFuelL"],
    "L"
)

print(
    "Average monthly fuel:",
    result["averageMonthlyFuelL"],
    "L"
)

print(
    "Average daily fuel:",
    result["averageDailyFuelL"],
    "L/day"
)

print(
    "Demonstration reserve:",
    result["fuelReserveL"],
    "L"
)

print(
    "Estimated days remaining:",
    result["estimatedDaysRemaining"]
)

print(
    "Source:",
    result["source"]
)

print(
    "Assumption:",
    result["assumption"]
)

print("================================")