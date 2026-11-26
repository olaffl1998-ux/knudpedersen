"use client";
import { useEffect, useState } from "react";
import { business } from "@/lib/site";
/** Åbningstider med dagens række fremhævet */
export default function Hours() {
    const [day, setDay] = useState(null);
    useEffect(() => {
        const dk = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Copenhagen" }));
        setDay(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dk.getDay()]);
    }, []);
    return (<table className="hours">
      <caption className="sr-only">Åbningstider</caption>
      <tbody>
        {business.openingHours.map((o) => (<tr key={o.label} className={day && o.days.includes(day) ? "is-today" : ""}>
            <th scope="row">{o.label}</th><td>{o.opens.replace(":", ".")}–{o.closes.replace(":", ".")}</td>
          </tr>))}
        <tr className={day === "Sunday" ? "is-today" : ""}><th scope="row">Søndag</th><td>Lukket</td></tr>
      </tbody>
    </table>);
}
