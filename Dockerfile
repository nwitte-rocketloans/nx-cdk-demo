FROM amazonlinux:2
WORKDIR /src

RUN amazon-linux-extras install -y docker \
    && yum install -y gcc-c++ make tar gzip git vim procps unzip \
    && yum clean all && rm -rf /var/cache/yum

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && sh ./aws/install

RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash - \
    && yum install -y nodejs \
    && npm install -g yarn

COPY .devcontainer/bashrc.sh /root/.bashrc
COPY .devcontainer/profile.sh /root/.profile
