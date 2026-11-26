import { getRolexPrice, submitInquiry, subscribeNewsletter } from "@/lib/server-fns";

/** Svarer som fetch (r.ok), så formularerne kan bruges uændret */
export async function postBooking(payload) {
  try {
    await submitInquiry({ data: payload });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function postNewsletter(payload) {
  try {
    await subscribeNewsletter({ data: payload });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export const fetchRolexPrice = (rmc) => getRolexPrice({ data: { rmc } }).catch(() => null);
