import { useTranslate } from "Components/shared/Translate";
import Link from "next/link";
import { useRouter } from "next/router";
import mixpanelService from "Services/mixpanel/initializeMixPanel";
import MixpanelEvent from "Services/mixpanel/mixpanelEvent";
import LoginForm from "../LoginForm";

interface LoginLinksProps {
    onEnrollClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function LoginLinks({ onEnrollClick }: LoginLinksProps): JSX.Element {
    const translate = useTranslate();

    return (
        <div className="linksContainer" data-testid="login-links-container">
            <div className="forgot-password">
                <Link
                    href="https://office.unicity.com/pwupdate/#/reset"
                    target="_blank"
                    rel="noreferrer"
                    data-testid="login-forgot-password-link"
                    aria-label={translate("login_forgot_password")}
                >
                    {translate("login_forgot_password")}
                </Link>
            </div>
            <Link
                className="enrollment-link"
                href="/home"
                onClick={onEnrollClick}
                aria-label={translate("login_enroll_now")}
                data-testid="login-enroll-now-link"
            >
                <span>
                    {translate("login_dont_have_account")}
                    <br />
                    {translate("login_enroll_now")}
                </span>
            </Link>
        </div>
    );
}

export default function LoginContent(): JSX.Element {
    const translate = useTranslate();
    const router = useRouter();

    const handleEnrollClick = (
        e: React.MouseEvent<HTMLAnchorElement>
    ): void => {
        e.preventDefault();
        mixpanelService.trackEvent(MixpanelEvent.LOGIN_DONT_HAVE_ACCOUNT);
        router.push("/home");
    };

    return (
        <div className="tile main" data-testid="login-content-container">
            <div
                className="wrapper"
                data-testid="login-upgrade-opportunity-section"
            >
                <div
                    className="title"
                    data-testid="login-upgrade-opportunity-title"
                >
                    {translate("login_upgrade_your_opportunity")}
                </div>
                <p data-testid="login-starting-unicity-business">
                    {translate("login_starting_unicity_business")}
                </p>
                <div className="subtitle" data-testid="login-member-sign-in">
                    {translate("login_member_sign_in")}
                </div>

                <LoginForm />

                <LoginLinks onEnrollClick={handleEnrollClick} />
            </div>
        </div>
    );
}
