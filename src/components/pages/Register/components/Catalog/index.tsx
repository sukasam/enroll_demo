/** @jsxImportSource @emotion/react */
import { useUser } from "Contexts/UserContext";
import { useState } from "react";
import CustomizerModal from "./components/CustomizerModal";
import NotReadySection from "./components/NotReadySection";
import PackSection from "./components/PackSection";

export default function Home(): JSX.Element {
    const [customizerModalID, setCustomizerModalID] = useState<number | null>(
        null
    );

    const { enrollerId } = useUser();

    return (
        <>
            <PackSection />
            <NotReadySection enrollerId={enrollerId} />
            {customizerModalID !== null && (
                <CustomizerModal
                    customizerModalID={customizerModalID}
                    setCustomizerModalID={setCustomizerModalID}
                />
            )}
        </>
    );
}
