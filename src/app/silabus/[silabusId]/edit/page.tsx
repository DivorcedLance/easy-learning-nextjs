'use client'

import { LoadingCharger } from "@/components/LoadingCharger";
import SilabusEditor from "@/components/SilabusEditor";
import { getSilabusById } from "@/lib/firebaseUtils";
import { Silabo } from "@/types/silabo";
import { useEffect, useState } from "react"

export default function EditSilabusPage({params}: {params: {silabusId: string}}) {
    const silabusId = params.silabusId
    const [silabus, setSilabus] = useState<Silabo | null>(null)
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const fetchSilabus = async () => {
            try {
                setLoading(true);
                await getSilabusById(silabusId).then((silabusData) => {
                    setSilabus(silabusData)
                    console.log("Silabus:", silabusData)
                })
            } catch (error) {
                console.error("Error al obtener la data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSilabus();
    }, [silabusId]);
    if (loading) return <LoadingCharger />;
    return (
        <SilabusEditor silabus={silabus} type="silabusPage"/>
    )
}
