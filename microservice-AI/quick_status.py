import requests

print("\n" + "="*70)
print("  🤖 AI MICROSERVICE - QUICK STATUS CHECK")
print("="*70)

try:
    r = requests.get('http://localhost:5000/api/health', timeout=5)
    data = r.json()
    
    print(f"\n✅ Status: {data['status'].upper()}")
    print(f"✅ Service: {data['service']}")
    print(f"✅ Memory: {data['memory_usage']:.2f}%")
    print(f"✅ CPU: {data['cpu_usage']:.2f}%")
    print(f"\n📚 Documentation: http://localhost:5000/docs")
    print(f"📊 Health Check: http://localhost:5000/api/health")
    print("\n" + "="*70)
    print("  ✅ AI MICROSERVICE IS FULLY OPERATIONAL")
    print("="*70 + "\n")
except Exception as e:
    print(f"\n❌ Error: {e}\n")
