import React from 'react';
import {
  Utensils,
  ShoppingBasket,
  Fuel,
  Zap,
  ShoppingBag,
  HeartPulse,
  Smartphone,
  Home,
  GraduationCap,
  Coffee,
  HandCoins,
  Wallet,
  CircleDollarSign,
  Car,
  Gift,
  Tv,
  Briefcase,
  Layers,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'Utensils':
      return <Utensils className={className} />;
    case 'ShoppingBasket':
      return <ShoppingBasket className={className} />;
    case 'Fuel':
      return <Fuel className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'HandCoins':
      return <HandCoins className={className} />;
    case 'Wallet':
      return <Wallet className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Gift':
      return <Gift className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'CircleDollarSign':
    default:
      return <CircleDollarSign className={className} />;
  }
};
