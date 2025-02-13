document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const unitFrom = document.getElementById("unit-from");
  const unitTo = document.getElementById("unit-to");
  const valueInput = document.getElementById("value");
  const convertButton = document.getElementById("convert-button");
  const resetButton = document.getElementById("reset-button");
  const resultDiv = document.querySelector(".result");

  // Conversion rates
  const conversionRates = {
    length: {
      m: { m: 1, cm: 100, mm: 1000, km: 0.001 },
      cm: { m: 0.01, cm: 1, mm: 10, km: 0.00001 },
      mm: { m: 0.001, cm: 0.1, mm: 1, km: 0.000001 },
      km: { m: 1000, cm: 100000, mm: 1000000, km: 1 },
    },
    mass: {
      tấn: { tấn: 1, kg: 1000, g: 1000000 },
      kg: { tấn: 0.001, kg: 1, g: 1000 },
      g: { tấn: 0.000001, kg: 0.001, g: 1 },
    },
    time: {
      giây: { giây: 1, phút: 1 / 60, giờ: 1 / 3600, ngày: 1 / 86400 },
      phút: { giây: 60, phút: 1, giờ: 1 / 60, ngày: 1 / 1440 },
      giờ: { giây: 3600, phút: 60, giờ: 1, ngày: 1 / 24 },
      ngày: { giây: 86400, phút: 1440, giờ: 24, ngày: 1 },
    },
    temperature: {
      formula: (value, from, to) => {
        if (from === "C" && to === "F") return (value * 9) / 5 + 32;
        if (from === "F" && to === "C") return ((value - 32) * 5) / 9;
        if (from === "C" && to === "K") return value + 273.15;
        if (from === "K" && to === "C") return value - 273.15;
        if (from === "F" && to === "K") return ((value - 32) * 5) / 9 + 273.15;
        if (from === "K" && to === "F") return ((value - 273.15) * 9) / 5 + 32;
        return value; // Nếu cùng đơn vị
      },
      units: ["C", "F", "K"],
    },
    velocity: {
      "m/s": {
        "m/s": 1,
        "m/phút": 60,
        "km/h": 3.6,
        "km/s": 0.001,
        "cm/s": 100,
      },
      "m/phút": {
        "m/s": 1 / 60,
        "m/phút": 1,
        "km/h": 0.06,
        "km/s": 0.0000167,
        "cm/s": 1.6667,
      },
      "km/h": {
        "m/s": 1 / 3.6,
        "m/phút": 16.6667,
        "km/h": 1,
        "km/s": 0.000277778,
        "cm/s": 27.7778,
      },
      "km/s": {
        "m/s": 1000,
        "m/phút": 60000,
        "km/h": 3600,
        "km/s": 1,
        "cm/s": 100000,
      },
      "cm/s": {
        "m/s": 0.01,
        "m/phút": 0.6,
        "km/h": 0.036,
        "km/s": 0.00001,
        "cm/s": 1,
      },
    },
  };

  // Determine conversion type based on page title
  const pageTitle = document.title.toLowerCase();
  let conversionType = null;

  if (pageTitle.includes("nhiệt độ")) conversionType = "temperature";
  else if (pageTitle.includes("thời gian")) conversionType = "time";
  else if (pageTitle.includes("khối lượng")) conversionType = "mass";
  else if (pageTitle.includes("chiều dài")) conversionType = "length";
  else if (pageTitle.includes("vận tốc")) conversionType = "velocity";

  // Validate conversion type
  if (!conversionType || !(conversionType in conversionRates)) {
    console.error("Loại chuyển đổi không được hỗ trợ!");
    return;
  }

  // Handle conversion
  convertButton.addEventListener("click", () => {
    const fromUnit = unitFrom.value;
    const toUnit = unitTo.value;
    const value = parseFloat(valueInput.value);

    if (isNaN(value)) {
      resultDiv.textContent = "Vui lòng nhập một giá trị hợp lệ!";
      resultDiv.style.color = "red";
      resultDiv.style.display = "block";
      return;
    }

    let result;
    if (conversionType === "temperature") {
      result = conversionRates.temperature.formula(value, fromUnit, toUnit);
    } else {
      const rate = conversionRates[conversionType]?.[fromUnit]?.[toUnit];
      if (rate == null) {
        resultDiv.textContent = "Không thể thực hiện chuyển đổi!";
        resultDiv.style.color = "red";
        resultDiv.style.display = "block";
        return;
      }
      result = value * rate;
    }

    resultDiv.textContent = `${value} ${fromUnit} = ${result.toFixed(
      2
    )} ${toUnit}`;
    resultDiv.style.color = "green";
    resultDiv.style.display = "block";
  });

  // Handle reset
  resetButton.addEventListener("click", () => {
    valueInput.value = "";
    resultDiv.style.display = "none";
  });
});
