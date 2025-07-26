import sys
import io
import time
import urllib.parse
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By

# Fix Windows encoding issues
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# === UPDATE THESE ===
CHROME_DRIVER_PATH = "D:/custom-editor/backend/chromedriver.exe"

# === Get template type from command line arg ===
if len(sys.argv) < 2:
    print("[ERROR] No template type provided.")
    sys.exit(1)

TEMPLATE_TYPE = sys.argv[1]
ENCODED_TEMPLATE_PATH = urllib.parse.quote(sys.argv[2]) if len(sys.argv) >= 3 else ""

url = f"https://34.221.119.194/product/postcards/?template={ENCODED_TEMPLATE_PATH}"
print(f"Opening URL: {url}")

# Launch browser
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
service = Service(CHROME_DRIVER_PATH)
driver = webdriver.Chrome(service=service, options=options)
driver.get(url)

time.sleep(5)

# === STEP 1: Click matching postcard button ===
print(f"Looking for template: {TEMPLATE_TYPE}")
buttons = driver.find_elements(By.CLASS_NAME, "ylhq_products")
found = False
for btn in buttons:
    if TEMPLATE_TYPE in btn.text:
        btn.click()
        found = True
        print(f"[SUCCESS] Clicked: {btn.text}")
        break

if not found:
    print("[WARNING] Template type button not found.")

# ... rest of your existing code ...

# === STEP 2: Set form dropdowns to 'No' ===
dropdown_ids = [
    "campaign_touches_1",
    "ylhq_offer_meter_option",
    "ylhq_select_auto_returnmail"
]

for dropdown_id in dropdown_ids:
    try:
        dropdown = driver.find_element(By.ID, dropdown_id)
        for option in dropdown.find_elements(By.TAG_NAME, 'option'):
            if option.get_attribute("value") == "no":
                option.click()
                break
    except Exception as e:
        print(f"⚠️ Skipped {dropdown_id}: {e}")

# One with a class name
try:
    dropdown = driver.find_element(By.CLASS_NAME, "fede_custom_option9")
    for option in dropdown.find_elements(By.TAG_NAME, 'option'):
        if option.get_attribute("value") == "no":
            option.click()
            break
except Exception as e:
    print(f"⚠️ Skipped fede_custom_option9: {e}")

print("✅ Form auto-filled.")
time.sleep(100)  # Wait for observation
# driver.quit()
