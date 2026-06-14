import { colors, fontSizes } from '../constants/theme';

export const LoginSafeAreaContainer = () => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: colors.lightBackground,
    paddingBottom: '72px',
    boxSizing: 'border-box',
});

export const LoginCenterArea = () => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '6px',
});

export const LoginFormWrapper = () => ({
    width: '94%',
    maxWidth: '388px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: '12px',
    paddingRight: '12px',
    backgroundColor: colors.white,
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12)', // Odpowiednik shadowOffset/opacity/radius z RN
});

export const LoginInnerContent = () => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    boxSizing: 'border-box',
});

export const LoginTitleRow = () => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
});

export const LoginTitleText = () => ({
    fontSize: fontSizes.extra_large,
    fontWeight: '600',
    color: colors.black,
    marginLeft: '8px',
    marginMargin: 0,
});

export const LoginDescription = () => ({
    color: colors.grey,
    fontSize: fontSizes.medium,
    textAlign: 'center',
    marginBottom: '12px',
    marginLeft: '12px',
    marginRight: '12px',
});

export const LoginButtonContainer = () => ({
    width: '94%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    marginTop: '12px',
});

export const LoginButton = () => ({
    backgroundColor: colors.black,
    paddingTop: '15px',
    paddingBottom: '15px',
    paddingLeft: '30px',
    paddingRight: '30px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)',
    '&:hover': {
        backgroundColor: colors.darkgrey,
    },
});

export const LoginButtonText = () => ({
    color: colors.white,
    fontSize: fontSizes.medium,
    fontWeight: '600',
});

export const LoginTitle = () => ({
    fontSize: fontSizes.mid_large,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: '16px',
    marginMargin: 0,
});

export const LoginFormScroll = () => ({
    width: '100%',
});

export const LoginFormScrollContent = () => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '12px',
    paddingBottom: '16px',
});

export const LoginFormContainer = () => ({
    width: '100%',
    maxWidth: '360px',
    marginBottom: 0,
    padding: '16px',
    borderRadius: '10px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
});

export const LoginLabelRow = () => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '6px',
});

export const LoginInputLabel = () => ({
    color: colors.black,
    fontSize: fontSizes.small,
    marginBottom: '6px',
    fontWeight: '700',
    alignSelf: 'flex-start',
});

export const LoginInput = () => ({
    width: '100%',                     // Wymusza pełną szerokość kontenera
    backgroundColor: colors.lightgrey,
    borderRadius: '8px',
    paddingLeft: '15px',
    paddingRight: '15px',
    paddingTop: '12px',
    paddingBottom: '12px',
    marginBottom: '15px',
    fontSize: fontSizes.medium,
    color: colors.black,
    boxSizing: 'border-box',           // DODANO: Zapewnia identyczne obliczanie szerokości z paddingiem jak w haśle
});

export const LoginPasswordInputWrapper = () => ({
    width: '100%',
    position: 'relative',
    marginBottom: '15px',
});

export const LoginPasswordInputField = () => ({
    width: '100%',                     // Wymusza pełną szerokość kontenera
    backgroundColor: colors.lightgrey,
    borderRadius: '8px',
    paddingLeft: '15px',
    paddingRight: '44px',              // Zostaje większy prawy padding na ikonę oka
    paddingTop: '12px',
    paddingBottom: '12px',
    fontSize: fontSizes.medium,
    color: colors.black,
    boxSizing: 'border-box',           // Pilnuje prawidłowego wymiaru pomimo dużego paddingu z prawej
});

export const LoginPasswordToggleAbsolute = () => ({
    position: 'absolute',
    right: '12px',
    top: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '6px',
    paddingRight: '6px',
    zIndex: 2,
});

export const LoginForgotInline = () => ({
    color: colors.black,
    fontSize: fontSizes.small,
    textDecoration: 'none',
    fontWeight: '700',
});

export const LoginValidationContainer = () => ({
    width: '100%',
    minHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 0,
});

export const LoginValidationError = () => ({
    color: colors.red,
    fontSize: fontSizes.small,
    fontWeight: '700',
    textAlign: 'center',
});

export const LoginSignInButton = () => ({
    backgroundColor: colors.black,
    paddingTop: '15px',
    paddingBottom: '15px',
    paddingLeft: '30px',
    paddingRight: '30px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)',
    '&:hover': {
        backgroundColor: '#1f2937',
    },
});

export const LoginSignInButtonDisabled = () => ({
    opacity: 1,
    backgroundColor: colors.darkgrey,
    cursor: 'not-allowed',
    '&:hover': {
        backgroundColor: colors.darkgrey, // Blokuje zmianę koloru przy hover gdy disabled
    },
});

export const LoginSignInButtonText = () => ({
    color: colors.white,
    fontSize: fontSizes.medium,
    fontWeight: '600',
});

export const LoginDividerContainer = () => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: '14px',
    marginBottom: '14px',
});

export const LoginDividerLine = () => ({
    flex: 1,
    height: '1px',
    backgroundColor: colors.lightgrey,
});

export const LoginDividerText = () => ({
    marginLeft: '12px',
    marginRight: '12px',
    color: colors.darkgrey,
    fontSize: fontSizes.small,
    textTransform: 'lowercase',
});

export const LoginDevButtonsCol = () => ({
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
});

export const LoginFieldError = () => ({
    color: colors.red,
    fontSize: fontSizes.small,
    fontWeight: '700',
    marginTop: '-6px',
    marginBottom: '8px',
    alignSelf: 'flex-start',
});

// Dynamiczna funkcja przyjmująca stan walidacji i zwracająca odpowiedni kolor w sx
export const LoginPasswordRequirement = (isValid: boolean) => ({
    marginLeft: '6px',
    color: isValid ? colors.green : colors.red,
    fontSize: fontSizes.small,
    fontWeight: '700',
});

export const LoginPasswordRequirementRow = () => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '2px',
    width: '100%',
});