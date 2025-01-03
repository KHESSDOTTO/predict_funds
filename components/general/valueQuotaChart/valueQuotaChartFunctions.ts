import { consoleLog } from "@/utils/functions/genericFunctions";
import { AdjustValueQuotaChartAxisParamsType, ExportValueQuotaParams } from "./valueQuotaChartTypes";

function adjustValueQuotaChartAxis({
  historic,
  setDomainYaxisVQ,
  setTicksYaxisVQ,
}: AdjustValueQuotaChartAxisParamsType) {
  // Margin to aply to find the domain of the Yaxis on the charts
  const marginForDomain = 0.05;
  const ticksQntYaxisVQ = 7;

  // Defining domain values for axis of Value Quota Chart
  const minValueVQ = historic.reduce((minObj, currObj) => {
    return currObj["VL_QUOTA_ms"] < minObj["VL_QUOTA_ms"] ? currObj : minObj;
  }, historic[0])["VL_QUOTA_ms"];
  const maxValueVQ = historic.reduce((maxObj, currObj) => {
    return currObj["VL_QUOTA_ms"] > maxObj["VL_QUOTA_ms"] ? currObj : maxObj;
  }, historic[0])["VL_QUOTA_ms"];

  // Domain of the Yaxis
  const minValYaxisVQ = minValueVQ * (1 - marginForDomain),
    maxValYaxisVQ = maxValueVQ * (1 + marginForDomain);
  setDomainYaxisVQ([minValYaxisVQ, maxValYaxisVQ]);

  const ticksIntervalYaxisVQ =
    (maxValYaxisVQ - minValYaxisVQ) / (ticksQntYaxisVQ - 1);
  const newTicksYaxisVQ = Array.from(
    { length: ticksQntYaxisVQ },
    (_, index) => minValYaxisVQ + ticksIntervalYaxisVQ * index
  );

  setTicksYaxisVQ(newTicksYaxisVQ);
}

function exportValueQuota({
    historic
}: ExportValueQuotaParams) {
    consoleLog({ historic });
    return;
}

export { adjustValueQuotaChartAxis };
