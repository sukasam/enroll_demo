/** @jsxImportSource @emotion/react */
import clsx from "clsx";

import { Grid } from "@mui/material";

import LocalImage from "Components/shared/LocalImage";
import StyledRadio from "Components/shared/StyledRadio";
import radioContainerStyles, { errorMessageStyles } from "./styles";

function RadioContainer({
    label,
    icon,
    value,
    checked,
    setChecked,
    children,
    noBoldLabel,
    alwaysShowChildren,
    edit,
    error,
    dataTest
}) {
    const isChecked = value === checked;

    return (
        <>
            <div
                className={clsx({
                    checked: isChecked,
                    error
                })}
                css={radioContainerStyles}
            >
                <Grid
                    alignItems="center"
                    className="top"
                    container
                    data-testid={dataTest}
                    onClick={() => setChecked(value)}
                >
                    <Grid item>
                        <Grid alignItems="center" container flexWrap="nowrap">
                            <StyledRadio
                                checked={isChecked}
                                className="radio"
                            />
                            <span
                                className={clsx("label", {
                                    noBoldLabel: !isChecked && noBoldLabel
                                })}
                            >
                                {label}
                            </span>
                        </Grid>
                    </Grid>
                    <Grid className="right" item>
                        {edit && edit}
                        {icon && (
                            <LocalImage height="18" src={icon} width="24" />
                        )}
                    </Grid>
                </Grid>
                {(alwaysShowChildren || isChecked) && children && (
                    <Grid alignItems="center" className="bottom" container>
                        {children}
                    </Grid>
                )}
            </div>
            {error && <div css={errorMessageStyles}>{error}</div>}
        </>
    );
}

export default RadioContainer;
