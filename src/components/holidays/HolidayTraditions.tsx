import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  Crown,
  Flag,
  Flame,
  Waves,
  PartyPopper,
  Sunrise,
  Moon,
  Heart,
  Briefcase,
  Scroll,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Music,
  Utensils,
  Users,
  Flower2,
  Landmark,
  Info,
  Play,
} from 'lucide-react';
import {
  cambodiaHolidays,
  getHolidayTypeColor,
  getHolidayTypeLabel,
  type Holiday,
} from '../../data/cambodiaHolidays';

interface Props {
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  PartyPopper,
  Flag,
  Sunrise,
  Heart,
  Crown,
  Moon,
  Briefcase,
  Flame,
  Waves,
  Scroll,
  Sparkles,
};

const traditionIconMap: Record<string, React.ElementType> = {
  temple: Landmark,
  food: Utensils,
  dance: Music,
  music: Music,
  family: Users,
  flowers: Flower2,
  book: BookOpen,
  lantern: Flame,
  boat: Waves,
  water: Waves,
  default: Info,
};

// Extended tradition data for each holiday
interface TraditionDetail {
  title: string;
  description: string;
  icon: string;
}

const traditionDetails: Record<string, TraditionDetail[]> = {
  'khmer-new-year': [
    {
      title: 'Building Sand Pagodas',
      description:
        'Families build small sand pagodas at temples, decorating them with flowers and incense as offerings to Buddha and ancestors.',
      icon: 'temple',
    },
    {
      title: 'Water Throwing (Sraung Preah)',
      description:
        'People splash water on each other as a blessing, symbolizing the washing away of bad luck from the previous year.',
      icon: 'water',
    },
    {
      title: 'Traditional Games',
      description:
        'Bos Angkunh (seed throwing), Chol Chhoung (scarf throwing), Leak Kanseng (towel hiding), and other folk games are played.',
      icon: 'music',
    },
    {
      title: 'Bay Ben Ceremony',
      description:
        'At dawn, people throw roasted rice into the air or on the ground as offerings to spirits and ancestors.',
      icon: 'food',
    },
    {
      title: 'Elder Respect',
      description:
        'Young people wash their parents\' and grandparents\' feet and ask for blessings for the new year.',
      icon: 'family',
    },
    {
      title: 'Temple Visits',
      description:
        'Families visit pagodas to make offerings, listen to sermons, and participate in Buddhist ceremonies.',
      icon: 'temple',
    },
  ],
  'pchum-ben': [
    {
      title: 'Bay Ben Offering',
      description:
        'Before dawn, people prepare sticky rice balls mixed with sesame and coconut, offering them to monks who are vessels for deceased ancestors.',
      icon: 'food',
    },
    {
      title: 'Early Temple Visits',
      description:
        'Families visit pagodas between 4:00 AM and 6:00 AM during the 15-day period, believing spirits are most active at dawn.',
      icon: 'temple',
    },
    {
      title: 'White Clothing',
      description:
        'Devotees wear white when visiting temples, symbolizing purity and respect for the deceased.',
      icon: 'family',
    },
    {
      title: 'Praying for Ancestors',
      description:
        'People pray for up to seven generations of deceased relatives to help them find peace and liberation.',
      icon: 'lantern',
    },
    {
      title: 'Monk Offerings',
      description:
        'Food, robes, and other necessities are offered to monks, who transfer merit to the spirits of ancestors.',
      icon: 'flowers',
    },
  ],
  'bon-om-touk': [
    {
      title: 'Boat Racing',
      description:
        'Colorful longboats with up to 80 paddlers race on the Tonle Sap River in a spectacular competition watched by millions.',
      icon: 'boat',
    },
    {
      title: 'Floating Lanterns',
      description:
        'Thousands of lanterns are released onto the water at night, creating a magical scene along the riverbanks.',
      icon: 'lantern',
    },
    {
      title: 'Eating Ambok',
      description:
        'Ambok, a dish of flattened rice mixed with coconut and banana, is traditionally eaten at midnight under the full moon.',
      icon: 'food',
    },
    {
      title: 'Sampeah Preah Khae',
      description:
        'A ceremony honoring the moon, where people make offerings and prayers for good fortune in the coming year.',
      icon: 'music',
    },
  ],
  'independence-day': [
    {
      title: 'Flag Hoisting',
      description:
        'The national flag is raised at Independence Monument in Phnom Penh with military honors and gun salutes.',
      icon: 'flag',
    },
    {
      title: 'Military Parade',
      description:
        'A grand military parade showcases Cambodia\'s armed forces with marching troops and military vehicles.',
      icon: 'music',
    },
    {
      title: 'Fireworks Display',
      description:
        'Spectacular fireworks light up the sky over the Mekong River, visible from riverside parks and rooftops.',
      icon: 'lantern',
    },
    {
      title: 'Cultural Performances',
      description:
        'Traditional Khmer dance and music performances celebrate national heritage and cultural identity.',
      icon: 'dance',
    },
  ],
  'meak-bochea': [
    {
      title: 'Candlelight Procession',
      description:
        'Devotees walk around temples three times with candles, incense, and lotus flowers in a sacred circumambulation.',
      icon: 'lantern',
    },
    {
      title: 'Meditation Retreats',
      description:
        'Many Buddhists participate in meditation retreats at temples, focusing on mindfulness and spiritual practice.',
      icon: 'temple',
    },
    {
      title: 'Precept Observation',
      description:
        'Devout Buddhists observe the Eight Precepts for the day, abstaining from harmful activities.',
      icon: 'book',
    },
  ],
  'visak-bochea': [
    {
      title: 'Triple Celebration',
      description:
        'Commemorates three major events in Buddha\'s life: birth, enlightenment, and parinirvana (passing).',
      icon: 'temple',
    },
    {
      title: 'Bird and Fish Release',
      description:
        'Releasing captured birds and fish is a symbolic act of compassion and liberation.',
      icon: 'flowers',
    },
    {
      title: 'Lantern Lighting',
      description:
        'Colorful lanterns are lit at temples and homes, creating a serene atmosphere of reverence.',
      icon: 'lantern',
    },
  ],
  'victory-day': [
    {
      title: 'Wreath Laying',
      description:
        'Official ceremonies lay wreaths at memorials honoring victims of the Khmer Rouge regime.',
      icon: 'flowers',
    },
    {
      title: 'Educational Events',
      description:
        'Schools and institutions hold programs to educate younger generations about Cambodia\'s history.',
      icon: 'book',
    },
    {
      title: 'Moments of Silence',
      description:
        'The nation observes moments of silence to remember those who suffered and perished.',
      icon: 'family',
    },
  ],
};

// Default traditions for holidays without detailed data
function getDefaultTraditions(holiday: Holiday): TraditionDetail[] {
  const items: TraditionDetail[] = [];
  if (holiday.traditions) {
    return holiday.traditions.map((t) => ({
      title: t,
      description: `A cherished tradition during ${holiday.name}.`,
      icon: 'default',
    }));
  }
  if (holiday.isPublicHoliday) {
    items.push({
      title: 'Public Holiday',
      description: `This day is a public holiday in Cambodia. Government offices, schools, and many businesses are closed.`,
      icon: 'family',
    });
  }
  return items;
}

function TraditionCard({
  detail,
  index,
}: {
  detail: TraditionDetail;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const TIcon = traditionIconMap[detail.icon] || Info;

  return (
    <div
      className={`
        rounded-xl border border-gray-200 bg-white overflow-hidden
        hover:border-amber-300 hover:shadow-md transition-all duration-300
        ${expanded ? 'ring-1 ring-amber-200' : ''}
      `}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
      >
        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
          <TIcon className="w-4.5 h-4.5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-800 truncate">
            {detail.title}
          </h4>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
            expanded ? 'rotate-90' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          <p className="text-sm text-gray-600 leading-relaxed">{detail.description}</p>
        </div>
      )}
    </div>
  );
}

export function HolidayTraditions({ className }: Props) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter holidays that have traditions
  const holidaysWithTraditions = useMemo(() => {
    return cambodiaHolidays.filter((h) => {
      return (
        traditionDetails[h.id] || (h.traditions && h.traditions.length > 0)
      );
    });
  }, []);

  const activeHoliday = holidaysWithTraditions[activeIndex];

  const traditions = useMemo(() => {
    if (!activeHoliday) return [];
    return (
      traditionDetails[activeHoliday.id] ||
      getDefaultTraditions(activeHoliday)
    );
  }, [activeHoliday]);

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? holidaysWithTraditions.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === holidaysWithTraditions.length - 1 ? 0 : prev + 1
    );
  };

  if (!activeHoliday) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-8 text-center ${className || ''}`}>
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400">
          {t('holidayTraditions.noData', 'No tradition data available')}
        </p>
      </div>
    );
  }

  const Icon = iconMap[activeHoliday.icon] || Sparkles;

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className || ''}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${activeHoliday.bgGradient} px-6 py-5 relative overflow-hidden`}>
        <div className="absolute top-2 right-3 opacity-10">
          <Sparkles className="w-20 h-20 text-white" />
        </div>

        {/* Navigation arrows */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {activeIndex + 1} / {holidaysWithTraditions.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
                aria-label="Previous holiday"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
                aria-label="Next holiday"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Holiday info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">{activeHoliday.name}</h2>
              <p className="text-white/80 text-sm">{activeHoliday.nameKh}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Traditions list */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          {t('holidayTraditions.traditions', 'Traditional Activities')}
        </h3>

        <div className="space-y-2.5">
          {traditions.map((detail, i) => (
            <TraditionCard key={`${activeHoliday.id}-${i}`} detail={detail} index={i} />
          ))}
        </div>

        {/* Holiday dots navigation */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {holidaysWithTraditions.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`
                rounded-full transition-all duration-200
                ${
                  i === activeIndex
                    ? 'w-6 h-2 bg-amber-500'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }
              `}
              aria-label={`Go to holiday ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
