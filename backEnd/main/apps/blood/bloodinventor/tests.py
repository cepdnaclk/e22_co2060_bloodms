from django.test import TestCase

# Create your tests here.

class LiveStockApiTests(TestCase):
    def test_live_stock_returns_expected_shape(self):
        response = self.client.get("/api/v1/blood/live-stock/")

        self.assertEqual(response.status_code, 200)
        payload = response.json()

        self.assertIn("updatedAt", payload)
        self.assertIn("stocks", payload)
        self.assertEqual(len(payload["stocks"]), 8)

        first_item = payload["stocks"][0]
        self.assertIn("bloodType", first_item)
        self.assertIn("units", first_item)
        self.assertIn("status", first_item)
