import {colors, fontSizes} from '../constants/theme';

export const HeaderContainer = () => ({
    height: '64px',
    width: '100%',
    backgroundColor: colors.white,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: '8px',
    paddingTop: '12px',
    boxSizing: 'border-box',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
});

export const HeaderLogoRow = () => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
});

export const HeaderLogoText = () => ({
    color: colors.black,
    fontSize: fontSizes.large,
    marginLeft: '8px',
    fontWeight: '600',
    marginMargin: 0,
});