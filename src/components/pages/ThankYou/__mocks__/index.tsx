import { ThankYouProps } from "../index";

const ThankYou = jest.fn(
    ({ feedbackComponent }: ThankYouProps): JSX.Element => (
        <div data-testid="thank-you">
            Thank You Content
            {feedbackComponent}
        </div>
    )
);

export default ThankYou;
