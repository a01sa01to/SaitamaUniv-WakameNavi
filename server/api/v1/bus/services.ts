// /api/v1/bus/services?company=:company?(Seibu|KokusaiKogyo)&start=:start&goal=:goal?

import Bus from "~~/utils/Trasportation/Bus";

const { KokusaiKogyo, Seibu } = Bus;

export default defineEventHandler(async event => {
  const KK_BUS_STOPS = KokusaiKogyo.BUS_STOPS;
  const SEIBU_BUS_STOPS = Seibu.BUS_STOPS;

  const { company, start, goal } = getQuery(event) as { [K: string]: string };

  const validity = Bus.checkValidityOfBusStopCode(company, start, goal);

  if (!start) sendError(event, createError({ statusCode: 400, data: "A query-parameter 'start' is required." }));

  const services: Bus.Service[] = [];
  switch (company) {
    default:
      if (validity.KokusaiKogyo.start && validity.KokusaiKogyo.goal) services.push(...await KokusaiKogyo.getServices(KK_BUS_STOPS[start as keyof typeof KK_BUS_STOPS].id, KK_BUS_STOPS[goal as keyof typeof KK_BUS_STOPS].id));
      if (validity.Seibu.start && validity.Seibu.goal) services.push(...await Seibu.getServices(SEIBU_BUS_STOPS[start as keyof typeof SEIBU_BUS_STOPS].id, SEIBU_BUS_STOPS[goal as keyof typeof SEIBU_BUS_STOPS].id));
      break;

    case KokusaiKogyo.COMPANY_CODE:
      if (validity.KokusaiKogyo.start && validity.KokusaiKogyo.goal) services.push(...await KokusaiKogyo.getServices(KK_BUS_STOPS[start as keyof typeof KK_BUS_STOPS].id, KK_BUS_STOPS[goal as keyof typeof KK_BUS_STOPS].id));
      break;

    case Seibu.COMPANY_CODE:
      // services.push(...await Seibu.getServices("00110252", "00110264"));
      if (validity.Seibu.start && validity.Seibu.goal) services.push(...await Seibu.getServices(SEIBU_BUS_STOPS[start as keyof typeof SEIBU_BUS_STOPS].id, SEIBU_BUS_STOPS[goal as keyof typeof SEIBU_BUS_STOPS].id));
      break;
  }

  return services;
});