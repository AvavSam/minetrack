export type Lisensi = "valid" | "pending";

export type Mine = {
  _id: string;
  namaTambang: string;
  tipeTambang: string;
  koordinat: {
    lat: number;
    lng: number;
  };
  lisensi: Lisensi;
  deskripsi: string;
  verifikasi: boolean;
  dampakLingkungan?: {
    cuaca?: {
      temp_c?: number;
      condition?: {
        text?: string;
        icon?: string;
      };
    };
    kualitasUdara?: {
      pm2_5?: number;
      co?: number;
      no2?: number;
      o3?: number;
      so2?: number;
    };
  };
  createdAt: string;
  updatedAt: string;
};
