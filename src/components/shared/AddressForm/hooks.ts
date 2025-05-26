import { Alpha2 } from "Constants/countryConfig/enums";
import getRegions from "Hydra/getRegions";

export default async function getStates(alpha2: Alpha2): Promise<any> {
    const rawRegions = await getRegions(alpha2);

    return [
        { label: "Select", value: "", disabled: true },
        ...(rawRegions && rawRegions.items
            ? rawRegions.items.map(region => ({
                  label: region.name,
                  value: region.value
              }))
            : [])
    ];
}
