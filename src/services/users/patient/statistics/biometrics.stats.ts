import { Helper } from "../../../../common/helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { LineChartOptions, DefaultChartOptions, ChartColors, MultiLineChartOptions } from "../../../../modules/charts/chart.options";
import {
    addLabeledText,
    addRectangularChartImage,
    chartExists,
    RECTANGULAR_CHART_HEIGHT,
    RECTANGULAR_CHART_WIDTH } from "./report.helper";
import { addSectionTitle, addNoDataDisplay, addLegend } from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const addBodyWeightStats = (model: any, document: PDFKit.PDFDocument, y: any) => {

    const chartImage = 'BodyWeight_Last6Months';
    const detailedTitle = 'Body Weight (Kg) Trend Over 6 Months';
    const titleColor = '#505050';
    const sectionTitle = 'Body Weight';
    const icon = Helper.getIconsPath('body-weight.png');
    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;

        let value = model.Stats.Biometrics.Last6Months.BodyWeight.AverageBodyWeight.toFixed();
        y = addLabeledText(document, 'Average Weight (Kg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BodyWeight.CurrentBodyWeight.toString();
        y = addLabeledText(document, 'Current Body Weight (Kg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BodyWeight.LastMeasuredDate.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);
    }

    return y;
};

export const addBloodPressureStats = (model: any, document: PDFKit.PDFDocument, y: any) => {

    const chartImage = 'BloodPressure_Last6Months';
    const detailedTitle = 'Blood Pressure Trend Over 6 Months';
    const titleColor = '#505050';
    const sectionTitle = 'Blood Pressure';
    const icon = Helper.getIconsPath('blood-pressure.png');

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;

        let value = model.Stats.Biometrics.Last6Months.BloodPressure.CurrentBloodPressureDiastolic.toString();
        y = addLabeledText(document, 'Recent Diastolic BP (mmHg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodPressure.CurrentBloodPressureSystolic.toString();
        y = addLabeledText(document, 'Recent Systolic BP (mmHg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodPressure.LastMeasuredDate.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);
    }

    return y;
};

export const addBloodGlucoseStats = (model: any, document: PDFKit.PDFDocument, y: any) => {

    const chartImage = 'BloodGlucose_Last6Months';
    const detailedTitle = 'Blood Glucose Trend Over 6 Months';
    const titleColor = '#505050';
    const sectionTitle = 'Blood Glucose';
    const icon = Helper.getIconsPath('blood-sugar.png');

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;

        let value = model.Stats.Biometrics.Last6Months.BloodGlucose.CurrentBloodGlucose?.toString();
        y = addLabeledText(document, 'Recent Blood Glucose (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodGlucose.LastMeasuredDate?.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);
    }

    return y;
};

export const addCholesterolStats = (model: any, document: PDFKit.PDFDocument, y: any) => {

    const chartImage = 'Cholesterol_Last6Months';
    const detailedTitle = 'Lipids Trend Over 6 Months';
    const titleColor = '#505050';
    const sectionTitle = 'Lipids';
    const icon = Helper.getIconsPath('blood-lipids.png');

    const lipidColors = getLipidColors();

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;
        y = addLegend(document, y, lipidColors, 200, 11, 65, 6, 10);
    }
    return y;
};

export const createBiometricsCharts = async (data) => {
    var locations = [];

    const bodyWeightLocations = await createBodyWeightCharts(data.Last6Months.BodyWeight.History);
    locations.push(...bodyWeightLocations);
    const bloddPressureLocations = await createBloodPressureCharts(data.Last6Months.BloodPressure.History);
    locations.push(...bloddPressureLocations);
    const bloodGlucoseLocations = await createBloodGlucoseCharts(data.Last6Months.BloodGlucose.History);
    locations.push(...bloodGlucoseLocations);
    const cholesterolLocations = await createCholesterolCharts(data.Last6Months.Cholesterol);
    locations.push(...cholesterolLocations);

    return locations;
};

const createBodyWeightCharts = async (data) => {
    var locations = [];
    const location = await createBodyWeight_LineChart(data, 'BodyWeight_Last6Months');
    locations.push({
        key : 'BodyWeight_Last6Months',
        location
    });
    return locations;
};

const createBloodPressureCharts = async (data) => {
    var locations = [];
    const location = await createBloodPressure_MultiLineChart(data, 'BloodPressure_Last6Months');
    locations.push({
        key : 'BloodPressure_Last6Months',
        location
    });
    return locations;
};

const createBloodGlucoseCharts = async (data) => {
    var locations = [];
    const location = await createBloodGlucose_LineChart(data, 'BloodGlucose_Last6Months');
    locations.push({
        key : 'BloodGlucose_Last6Months',
        location
    });
    return locations;
};

const createCholesterolCharts = async (data) => {
    var locations = [];
    const location = await createCholesterolCharts_MultiLineChart(data, 'Cholesterol_Last6Months');
    locations.push({
        key : 'Cholesterol_Last6Months',
        location
    });
    return locations;
};

const createBodyWeight_LineChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = stats.map(c => {
        return {
            x : new Date(c.DayStr),
            y : c.BodyWeight
        };
    });
    const options: LineChartOptions = DefaultChartOptions.lineChart();
    options.Width = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.XAxisTimeScaled = true;
    options.YLabel = 'Body weight';
    return await ChartGenerator.createLineChart(temp, options, filename);
};

const createBloodGlucose_LineChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = stats.map(c => {
        return {
            x : new Date(c.DayStr),
            y : c.BloodGlucose
        };
    });
    const options: LineChartOptions = DefaultChartOptions.lineChart();
    options.Width = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.Color = ChartColors.BlueViolet;
    options.XAxisTimeScaled = true;
    options.YLabel = 'Blood Glucose';
    return await ChartGenerator.createLineChart(temp, options, filename);
};

const createBloodPressure_MultiLineChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = [];
    for (var c of stats) {
        temp.push({
            x : new Date(c.DayStr),
            y : c.Diastolic,
            z : 'Diastolic'
        });
        temp.push({
            x : new Date(c.DayStr),
            y : c.Systolic,
            z : 'Systolic'
        });
    }
    const options: MultiLineChartOptions = DefaultChartOptions.multiLineChart();
    options.Width = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.XAxisTimeScaled = true;
    const categoryColors = getBloodPressureTypeColors();
    const categories = categoryColors.map(x => x.Key);
    const colors = categoryColors.map(x => x.Color);
    options.Categories = categories;
    options.Colors = colors;
    options.YLabel = 'mmHg';

    return await ChartGenerator.createMultiLineChart(temp, options, filename);
};

const createCholesterolCharts_MultiLineChart = async (stats: any, filename: string) => {

    const getRecords = (c) => {
        return {
            x : new Date(c.DayStr),
            y : c.PrimaryValue,
            z : c.DisplayName,
        };
    };

    const temp = [];
    let records = [];

    records = stats.TotalCholesterol.map(getRecords);
    temp.push(...records);
    records = stats.HDL.map(getRecords);
    temp.push(...records);
    records = stats.LDL.map(getRecords);
    temp.push(...records);
    records = stats.TriglycerideLevel.map(getRecords);
    temp.push(...records);
    records = stats.A1CLevel.map(getRecords);
    temp.push(...records);

    if (temp.length === 0) {
        return null;
    }

    const categoryColors = getLipidColors();
    const categories = categoryColors.map(x => x.Key);
    const colors = categoryColors.map(x => x.Color);
    const options: MultiLineChartOptions = DefaultChartOptions.multiLineChart();
    options.Width = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.XAxisTimeScaled = true;
    options.YLabel = '';
    options.StrokeWidth = 1.5;
    options.Colors = colors;
    options.Categories = categories;

    return await ChartGenerator.createMultiLineChart(temp, options, filename);
};

const getLipidColors = () => {
    const items = [
        {
            Key   : 'Total Cholesterol',
            Color : ChartColors.Coral,
        },
        {
            Key   : 'HDL',
            Color : ChartColors.MediumSeaGreen,
        },
        {
            Key   : 'LDL',
            Color : ChartColors.Purple,
        },
        {
            Key   : 'Triglyceride Level',
            Color : ChartColors.DarkSlateGray,
        },
        {
            Key   : 'A1C Level',
            Color : ChartColors.DodgerBlue,
        },
    ];
    return items;
};

const getBloodPressureTypeColors = () => {
    const items = [
        {
            Key   : 'Diastolic',
            Color : ChartColors.MediumSeaGreen,
        },
        {
            Key   : 'Systolic',
            Color : ChartColors.DodgerBlue,
        },
    ];
    return items;
};
