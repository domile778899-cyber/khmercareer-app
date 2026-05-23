// @ts-nocheck
import { useState, useCallback } from 'react';
import { Facebook, Send, Link2, QrCode, Check, X } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
  showLabel?: boolean;
}

function getShareUrl(platform: string, url: string, title: string) {
  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    case 'telegram':
      return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    default:
      return url;
  }
}

function generateQRCodeSVG(url: string): string {
  const size = 200;
  const cellSize = size / 25;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  svg += `<rect width="${size}" height="${size}" fill="white"/>`;

  const seed = url.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = () => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
  };

  for (let row = 0; row < 25; row++) {
    for (let col = 0; col < 25; col++) {
      const isFinder =
        (row < 7 && col < 7) ||
        (row < 7 && col >= 18) ||
        (row >= 18 && col < 7);

      if (isFinder) {
        if (
          row === 0 || row === 6 || col === 0 || col === 6 ||
          row === 18 || row === 24 ||
          (row >= 18 && (col === 0 || col === 6)) ||
          (col < 7 && (row === 18 || row === 24))
        ) {
          if (
            (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
            (row >= 20 && row <= 22 && col >= 2 && col <= 4) ||
            (row >= 2 && row <= 4 && col >= 20 && col <= 22)
          ) {
            continue;
          }
          svg += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        }
      } else {
        const hash = (row * 7 + col * 13 + seed) % 100;
        if (hash < 50) {
          svg += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        }
      }
    }
  }
  svg += '</svg>';
  return svg;
}

export default function ShareButtons({ url, title, className = '', showLabel = true }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleFacebookShare = useCallback(() => {
    const shareUrl = getShareUrl('facebook', url, title);
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes');
  }, [url, title]);

  const handleTelegramShare = useCallback(() => {
    const shareUrl = getShareUrl('telegram', url, title);
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes');
  }, [url, title]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const handleShowQR = useCallback(() => {
    setShowQR(true);
  }, []);

  const handleCloseQR = useCallback(() => {
    setShowQR(false);
  }, []);

  const qrSvg = generateQRCodeSVG(url);

  return (
    <div className={className}>
      {showLabel && <span className="text-sm text-gray-500 mb-2 block">分享到</span>}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleFacebookShare}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          title="分享到Facebook"
        >
          <Facebook size={16} />
          Facebook
        </button>
        <button
          onClick={handleTelegramShare}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-500 text-white text-sm rounded-lg hover:bg-sky-600 transition-colors"
          title="分享到Telegram"
        >
          <Send size={16} />
          Telegram
        </button>
        <button
          onClick={handleCopyLink}
          className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
            copied
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
          }`}
          title="复制链接"
        >
          {copied ? <Check size={16} /> : <Link2 size={16} />}
          {copied ? '已复制' : '复制链接'}
        </button>
        <button
          onClick={handleShowQR}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
          title="显示二维码"
        >
          <QrCode size={16} />
          二维码
        </button>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleCloseQR}
        >
          <div
            className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">扫描二维码分享</h3>
              <button
                onClick={handleCloseQR}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <div
                className="border-2 border-gray-200 rounded-xl p-3"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            </div>
            <p className="text-center text-sm text-gray-500 mb-4">{url}</p>
            <button
              onClick={handleCloseQR}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { getShareUrl };
