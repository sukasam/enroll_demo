import { useTranslate } from "Components/shared/Translate";
import Link from "next/link";
import { useRouter } from "next/router";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import LoginForm from "../LoginForm";

export default function LoginContent(): JSX.Element {
    const translate = useTranslate();
    const router = useRouter();

    const fireEvent = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        mixpanelService.trackEvent(MixpanelEvent.LOGIN_DONT_HAVE_ACCOUNT);
        router.push("/home");
    };

    return (
        <div className="tile main">
            <div className="wrapper" data-testid="upgrade_opportunity_section">
                <div
                    className="title"
                    data-testid="login_upgrade_your_opportunity"
                >
                    {translate("login_upgrade_your_opportunity")}
                </div>
                <p data-testid="login_starting_unicity_business">
                    {translate("login_starting_unicity_business")}
                </p>
                <div className="subtitle" data-testid="login_member_sign_in">
                    {translate("login_member_sign_in")}
                </div>

                <LoginForm />

                <div className="linksContainer">
                    <div className="forgot-password">
                        <Link
                            href="https://office.unicity.com/pwupdate/#/reset"
                            target="_blank"
                            rel="noreferrer"
                            data-testid="login_forgot_password"
                        >
                            {translate("login_forgot_password")}
                        </Link>
                    </div>
                    <Link
                        className="enrollment-link"
                        href="/home"
                        onClick={fireEvent}
                        aria-label="Enrollment Link"
                        data-testid="login_enroll_now"
                    >
                        <span
                            dangerouslySetInnerHTML={{
                                __html: `${translate(
                                    "login_dont_have_account"
                                )}<br>${translate("login_enroll_now")}`
                            }}
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
