/* eslint-disable no-use-before-define */
import Image from "next/image";

function LocalImage({ src, priority, ...props }) {
    if (!src) {
        src = "";
    }
    const imageProps = { ...props, src };

    // Handle SVG files differently
    if (src.endsWith(".svg")) {
        return (
            <img
                {...imageProps}
                src={`${window.location.origin}${src}`}
                alt={imageProps.alt || ""}
            />
        );
    }

    const myLoader = ({ src }) => `${window.location.origin}/${src}`;

    return (
        <Image
            alt={imageProps.alt}
            {...imageProps}
            priority={priority}
            loader={myLoader}
            unoptimized
        />
    );
}

export default LocalImage;
