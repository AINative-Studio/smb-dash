#!/bin/bash
#
# Quick Blockchain Forensics Analysis
# Usage: ./quick-analyze.sh <TOKEN_ADDRESS> [OPTIONS]
#

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

# Default values
TOKEN_CONTRACT="${1:-0x982F720fbcf3fa55da3621AB1aC3532c5FE5f07A}"
LIMIT="${2:-1000}"
OUTPUT_DIR="${3:-./forensics_output}"

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Blockchain Forensic Quick Analysis${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Token:${NC} $TOKEN_CONTRACT"
echo -e "${YELLOW}Limit:${NC} $LIMIT transfers"
echo -e "${YELLOW}Output:${NC} $OUTPUT_DIR"
echo ""

# Check if forensics script exists
if [ ! -f "$PROJECT_ROOT/boomscan_forensics.py" ]; then
    echo -e "${RED}Error: boomscan_forensics.py not found in project root${NC}"
    echo "Please ensure the script is at: $PROJECT_ROOT/boomscan_forensics.py"
    exit 1
fi

# Run analysis
echo -e "${GREEN}Running analysis...${NC}"
echo ""

cd "$PROJECT_ROOT"
TOKEN_CONTRACT="$TOKEN_CONTRACT" LIMIT="$LIMIT" python3 boomscan_forensics.py

EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Analysis complete!${NC}"
else
    echo -e "${RED}❌ Analysis failed with exit code $EXIT_CODE${NC}"
    exit $EXIT_CODE
fi
