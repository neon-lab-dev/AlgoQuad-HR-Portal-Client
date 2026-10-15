import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import signature from "../../../assets/images/signature.png";
import logo from "../../../assets/icons/logo.png";
import { formatDate } from "../../../utils/formatDate";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "column",
  },
  hotelText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#b91c1c",
    marginBottom: 5,
  },
  logoName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A7711A",
  },
  invoiceText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#b91c1c",
  },
  paidBadge: {
    backgroundColor: "#ECFDF5",
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 5,
    borderRadius: 4,
    alignSelf: "flex-start",
  },

  paidText: {
    color: "#16A34A",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
  },

  headerRight: {
    alignItems: "flex-end",
  },
  invoiceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  invoiceDetails: {
    flexDirection: "column",
    width: "50%",
  },
  invoiceTo: {
    flexDirection: "column",
    width: "50%",
  },
  label: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: "semibold",
    marginBottom: 8,
  },
  address: {
    fontSize: 10,
    lineHeight: 1.2,
    fontWeight: "semibold",
  },
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#b91c1c",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  col1: {
    width: "50%",
    fontSize: 10,
  },
  col2: {
    width: "20%",
    fontSize: 10,
    textAlign: "right",
  },
  col3: {
    width: "15%",
    fontSize: 10,
    textAlign: "center",
  },
  col4: {
    width: "15%",
    fontSize: 10,
    textAlign: "right",
  },
  headerText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  termsSection: {
    flexDirection: "row",
    marginBottom: 30,
  },
  termsText: {
    width: "60%",
    fontSize: 8,
    color: "#666666",
    lineHeight: 1.2,
    paddingRight: 10,
  },
  termsTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 10,
  },
  totals: {
    width: "40%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
  },
  grandTotal: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#b91c1c",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactColumn: {
    // flexDirection: 'column',
  },
  signatureSection: {
    alignItems: "center",
  },
  signatureLine: {
    width: 200,
    height: 1,
    backgroundColor: "#000000",
    marginBottom: 5,
  },
  contactText: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 7,
  },
  signatureText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  positionText: {
    fontSize: 10,
    color: "#666666",
    fontStyle: "italic",
    marginTop: 3,
  },
  socialMedia: {
    alignItems: "center",
    marginTop: 10,
  },
  boldText: {
    fontWeight: "bold",
  },

  thankYouSection: {
    marginTop: 30,
    paddingVertical: 10,
    width: "100%",
    backgroundColor: "#b91c1c",
    justifyContent: "center",
    alignItems: "center",
  },

  thankYouText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

type OrderedItem = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

type InvoiceData = {
  invoiceId?: string;
  date?: string | Date;
  customerName?: string;
  customerAddress?: string;
  orderedItems: OrderedItem[];
};

const Invoice = ({ data }: { data: InvoiceData }) => {
  const subtotal = data?.orderedItems?.reduce(
  (acc, item) => acc + Number(item.total),
  0
);

const tax = +(subtotal ? subtotal * 0.18 : 0).toFixed(2);
const grandTotal = subtotal ? subtotal + tax : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={styles.headerRight}>
              <Image src={logo} style={{ width: 150, height: 60 }} />
              <Text style={styles.logoName}>Hanjifinance</Text>
            </View>

            <View style={styles.headerLeft}>
              <Text style={styles.invoiceText}>INVOICE</Text>
              <Text style={styles.value}>Invoice No: {data?.invoiceId}</Text>
            </View>
          </View>

          {/* Invoice Information */}
          <View style={styles.invoiceInfo}>
            <View style={styles.invoiceDetails}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.paidText}>PAID</Text>

              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{formatDate(data?.date)}</Text>
            </View>
            <View style={styles.invoiceTo}>
              <Text style={styles.label}>Invoice to</Text>
              <Text style={styles.value}>{data?.customerName}</Text>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.address}>{data?.customerAddress}</Text>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.col1, styles.headerText]}>Item Name</Text>
              <Text style={[styles.col2, styles.headerText]}>Price</Text>
              <Text style={[styles.col3, styles.headerText]}>Qty</Text>
              <Text style={[styles.col4, styles.headerText]}>Total</Text>
            </View>

            {/* Table Rows */}
            {data?.orderedItems?.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>{item.name}</Text>
                <Text style={styles.col2}>{item.price}</Text>
                <Text style={styles.col3}>{item.quantity}</Text>
                <Text style={styles.col4}>{item.total}</Text>
              </View>
            ))}
          </View>

          {/* Terms and Totals Section */}
          <View style={styles.termsSection}>
            <View style={styles.termsText}>
              {/* <Text style={styles.termsTitle}>Terms and conditions</Text>
              <Text>Lorem ipsum dolor sit amet conect</Text>
              <Text>tation adipiscing elit, sed diam</Text>
              <Text>nonummy nibh euismod tincid</Text> */}
            </View>
            <View style={styles.totals}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>
                  INR {subtotal ? subtotal.toFixed(2) : "0.00"}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax</Text>
                <Text style={styles.totalValue}>INR {tax}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, styles.grandTotal]}>
                  Grand Total
                </Text>
                <Text style={[styles.totalValue, styles.grandTotal]}>
                  INR {grandTotal}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.contactColumn}>
              <Text style={styles.contactText}>
                <Text style={styles.boldText}>Email:</Text>{" "}
                info@hanjifinance.com
              </Text>
              <Text style={styles.contactText}>
                <Text style={styles.boldText}>Phone Number:</Text> +91 98765
                00000
              </Text>
              <Text style={styles.contactText}>
                <Text style={styles.boldText}>Website:</Text>{" "}
                www.hanjifinance.com
              </Text>
            </View>

            {/* Signature section */}
            <View style={styles.signatureSection}>
              <Image src={signature} style={{ width: 80, height: 40 }} />
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>Amandeep Singh Juneja</Text>
              <Text style={styles.positionText}>CEO, Hanjifinance</Text>
            </View>
          </View>
        </View>

        {/* Footer Section */}
        <View style={{ marginTop: 20 }}>
          {/* Thank You box */}
          <View style={styles.thankYouSection}>
            <Text style={styles.thankYouText}>
              Thanks for Choosing Hanjifinance!
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
